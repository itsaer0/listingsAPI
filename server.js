/********************************************************************************
* WEB422 – Assignment 1
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Colin Reinhardt Student ID: 129657177 Date: 14-05-2025
*
* Published URL: ___________________________________________________________
*
********************************************************************************/

const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config();
const listingsDB = require('./modules/listingsDB');
const db = new listingsDB();
const HTTP_PORT = process.env.HTTP_PORT || 8080;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    {message: "API listening"}
});

app.post('/api/listings', (req, res) => {
    const data = req.body;
    db.addNewListing(data).then((newListing) => {
        res.status(201).json(newListing);
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
});

app.get('/api/listings', (req, res) => {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const name = req.query.name || null;

    db.getAllListings(page, perPage, name).then((listings) => {
        res.status(200).json(listings);
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
});

app.get('/api/listings/:id', (req, res) => {
    const id = req.params.id;

    db.getListingById(id).then((listing) => {
        if (listing) {
            res.status(200).json(listing);
        } else {
            res.status(404).json({error: "Listing not found"});
        }
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
});

app.put('/api/listings/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;

    db.updateListingById(data, id).then((result) => {
        if (result.nModified > 0) {
            res.status(200).json({message: "Listing updated successfully"});
        } else {
            res.status(404).json({error: "Listing not found"});
        }
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
});

app.delete('/api/listings/:id', (req, res) => {
    const id = req.params.id;

    db.deleteListingById(id).then((result) => {
        if (result.deletedCount > 0) {
            res.status(200).json({message: "Listing deleted successfully"});
        } else {
            res.status(404).json({error: "Listing not found"});
        }
    }).catch((err) => {
        res.status(500).json({error: err.message});
    });
});

app.use((req, res) => {
    res.status(404).json({error: "Not Found"});
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`API listening on port ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});
