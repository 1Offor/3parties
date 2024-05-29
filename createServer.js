const express = require('express');
const createServer = express();
const port = 8000;

createServer.use(express.json()); 
   
 let parties =  {
    APC: { name: 'APC', votes: 142820, candidate: 'Offor' },
    PDP: { name: 'PDP', votes: 190540, candidate: 'Chicobi' },
    LP: { name: 'LP', votes: 346055, candidate: 'Nwabuike' }
};


// 1. Create a party
createServer.post('/parties', (req, res) => {
    const { parties: name, Candidates: candidate } = req.body;
    if (!name || !candidate) {
        return res.status(400).send({ message: 'Party name and candidate are required' });
    }
    if (parties[name]) {
        return res.status(400).send({ message: 'Party already exists' });
    }
    parties[name] = { name, votes: 0, candidate };
    res.status(201).send({ message: 'Party created successfully', party: parties[name] });
});

// 2. Get all the parties
createServer.get('/parties', (req, res) => {
    res.send(Object.values(parties));
});

// 3. Get a party by name
createServer.get('/parties/:name', (req, res) => {
    const { name } = req.params;
    const party = parties[name];
    if (!party) {
        return res.status(404).send({ message: 'Party not found' });
    }
    res.send(party);
});

// 4. Vote (update vote count)
createServer.post('/parties/:name/vote', (req, res) => {
    const { name } = req.params;
    const party = parties[name];
    if (!party) {
        return res.status(404).send({ message: 'Party not found' });
    }
    party.votes += 1;
    res.send({ message: 'Vote counted', party });
});

// 5. Delete a party
createServer.delete('/parties/:name', (req, res) => {
    const { name } = req.params;
    if (!parties[name]) {
        return res.status(404).send({ message: 'Party not found' });
    }
    delete parties[name];
    res.status(204).send();
});

// 6. Leaderboard with total votes, winner, and percentage
createServer.get('/leaderboard', (req, res) => {
    const totalVotes = Object.values(parties).reduce((sum, party) => sum + party.votes, 0);
    const leaderboard = Object.values(parties)
        .sort((a, b) => b.votes - a.votes)
        .map(party => ({
            name: party.name,
            candidate: party.candidate,
            votes: party.votes,
            percentage: totalVotes > 0 ? ((party.votes / totalVotes) * 100).toFixed(2) + '%' : '0%'
        }));
    
    const winner = leaderboard.length > 0 ? leaderboard[0] : null;
    
    res.send({
        totalVotes,
        winner,
        leaderboard
    });
});

createServer.listen(port, () => {
    console.log(`I can only vote OfforChicobi`);
});



       

