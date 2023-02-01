exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(40)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(40)',
      notNull: true,
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
    user_id: {
      type: 'VARCHAR(40)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    is_liked: {
      type: 'BOOLEAN',
      notNull: true,
    },
  })
  pgm.addConstraint(
    'comment_likes',
    'unique_comment_id_and_user_id',
    'UNIQUE(comment_id, user_id)',
  )
}

exports.down = (pgm) => {
  pgm.dropTable('comment_likes')
}
