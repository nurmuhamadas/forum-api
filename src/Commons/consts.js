const ERROR_MESSAGE = {
  // NOT FOUND ERROR
  threadNotFound: 'Thread tidak ditemukan',
  commentNotFound: 'komentar tidak ditemukan',
  commentReplyNotFound: 'balasan komentar tidak ditemukan',

  // BAD REQUEST ERROR
  commentReplyPayloadMissingSpec:
    'tidak dapat membuat balasan komentar baru karena properti yang dibutuhkan tidak lengkap',
  commentReplyPayloadNotMatchSpec:
    'tidak dapat membuat balasan komentar baru karena tipe data tidak sesuai',

  // AUTHORIZATION ERROR
  haveNotAccess: 'Anda tidak berhak mengakses resource ini',
}

module.exports = {
  ERROR_MESSAGE,
}
