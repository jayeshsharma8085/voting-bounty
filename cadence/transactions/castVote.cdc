import Voting from 0x9d2ade18cb6bea1a

transaction(candidate: String) {
    execute {
        Voting.castVote(candidate: candidate)
    }
}