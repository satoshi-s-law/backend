import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Invoice, Readable } from '@radar/lnrpc';
import env from './env';
import { node, initNode } from './node';
import postsManager from './posts';

const twilio = require('twilio')

// Configure server
const app = express();
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());


// Routes
app.get('/api/posts', (req, res) => {
  res.json({ data: postsManager.getPaidPosts() });
});

app.get('/api/posts/:id', (req, res) => {
  const post = postsManager.getPost(parseInt(req.params.id, 10));
  if (post) {
    res.json({ data: post });
  } else {
    res.status(404).json({ error: `No post found with ID ${req.params.id}`});
  }
});

app.post('/api/posts', async (req, res, next) => {
  try {
    // const { name, content } = req.body;
    const { time, memo } = req.body;


    // if (!name || !content) {
    //   throw new Error('Fields name and content are required to make a post');
    // }

    // const post = postsManager.addPost(name, content);
    const invoice = await node.addInvoice({
      memo: memo,
      value: time,
      expiry: '70000', // 2 minutes
    });

    res.json({
      data: {
        paymentRequest: invoice.paymentRequest,
      },
    });
  } catch(err) {
    next(err);
  }
});

app.post('/api/message', (req, res) => {

  const { SMSmessage, clientNumber } = req.body
  const accountSid = 'ACf2ded36a3e23f21e3ebf792ddc595330'
  const token = '54c369e9f95f5451deb013fe490c210e'
  const client = new twilio(accountSid, token)
      
  client.messages.create({
        body: SMSmessage,
        to: clientNumber,  
        from: '+12029151761'
    })
    .then((message: any) => console.log(message.sid))
    .catch((err: any) => console.log(err))
  })


app.get('/', (req, res) => {
  res.send('You need to load the webpack-dev-server page, not the server page!');
});


// Initialize node & server
console.log('Initializing Lightning node...');
initNode().then(() => {
  console.log('Lightning node initialized!');
  console.log('Starting server...');
  app.listen(env.PORT, () => {
    console.log(`API Server started at http://localhost:${env.PORT}!`);
  });

  // Subscribe to all invoices, mark posts as paid
  const stream = node.subscribeInvoices() as any as Readable<Invoice>;
  stream.on('data', chunk => {
    // Skip unpaid / irrelevant invoice updates
    if (!chunk.settled || !chunk.amtPaidSat || !chunk.memo) return;

    // Extract post id from memo, skip if we can't find an id
    const id = parseInt(chunk.memo.replace('Lightning Posts post #', ''), 10);
    if (!id) return;

    // Mark the invoice as paid!
    postsManager.markPostPaid(id);
  });
});
