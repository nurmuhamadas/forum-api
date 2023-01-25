const RegisterThread = require('../../Domains/threads/entities/RegisterThread')

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository
  }

  async addThread(userId, useCasePayload) {
    const registerThread = new RegisterThread(userId, useCasePayload)
    return this._threadRepository.addThread(registerThread)
  }

  async getThread(threadId) {
    await this._threadRepository.verifyAvailableThread(threadId)
    return this._threadRepository.getThread(threadId)
  }
}

module.exports = ThreadUseCase
