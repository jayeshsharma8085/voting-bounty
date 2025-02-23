import Voting from 0x9d2ade18cb6bea1a

pub fun main(candidate: String): UInt64? {
    return Voting.getVotes(candidate: candidate)
}