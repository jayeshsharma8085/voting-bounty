import Voting from 0x9d2ade18cb6bea1a

transaction(candidateName: String) {
    
    let adminRef: &Voting.Administrator
    
    prepare(signer: AuthAccount) {
        self.adminRef = signer.borrow<&Voting.Administrator>(from: /storage/VotingAdmin)
            ?? panic("Could not borrow admin reference")
    }

    execute {
        self.adminRef.addCandidate(name: candidateName)
    }
}