db.schema.hasTable("private_messages").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("private_messages", function (t) {
      t.increments("id").primary();
      t.string("sender", 100);
      t.string("receiver", 100);
      t.string("text");
      t.string("chatid");
      t.string("accepted_by");
      t.string("seen_by");
      t.t.timestamp("created_at").defaultTo(db.fn.now());
    });
  }
});

db.schema.hasTable("user_friends").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("user_friends", function (t) {
      t.increments("id").primary();
      t.string("friendid").notNullable();
      t.string("userid").notNullable();
    });
  }
});

db.schema.hasTable("group_info").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("group_info", function (t) {
      t.string("groupid");
      t.string("group_name");
      t.string("member");
      t.boolean("is_admin");
      t.timestamp("in_date").defaultTo(db.fn.now());
      t.timestamp("left_date").nullable().defaultTo(null);
    });
  }
});
db.schema.hasTable("all_groups").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("all_groups", function (t) {
      t.string("groupid");
      t.string("group_name");
      t.string("member");
      t.string("admins");
      t.timestamp("created").defaultTo(db.fn.now());
    });
  }
});
db.schema.hasTable("user_chat").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("user_chat", function (t) {
      t.string("username");
      t.string("receiverName");
      t.timestamp("last_updated");
      t.string("type");
      t.string("groupid").nullable();
    });
  }
});
db.schema.hasTable("group_chat").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("group_chat", function (t) {
      t.increments("id").primary();
      t.string("groupid");
      t.string("chatid");
      t.string("sender").nullable();
      t.string("text");
      t.string("type");
      t.dateTime("created").defaultTo(db.fn.now());
      t.string("seen_by");
      t.string("accepted_by");
    });
  }
});
db.schema.hasTable("all_blogs").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("all_blogs", function (t) {
      t.string("blogid").notNullable().defaultTo(uid());
      t.string("userid").notNullable();
      t.string("body");
      t.string("title");
      t.integer("like_count").defaultTo(0);
      t.integer("comment_count").defaultTo(0);
      t.timestamp("created_on").defaultTo(db.fn.now());
    });
  }
});
db.schema.hasTable("all_blogs").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("all_blogs", function (t) {
      t.string("blogid").notNullable().defaultTo(uid());
      t.string("userid").notNullable();
      t.string("body");
      t.string("title");
      t.integer("like_count").defaultTo(0);
      t.integer("comment_count").defaultTo(0);
      t.timestamp("created_on").defaultTo(db.fn.now());
    });
  }
});
db.schema.hasTable("all_comments").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("all_comments", function (t) {
      t.string("commentid").defaultTo(uid());
      t.string("userid");
      t.string("text").nullable();
      t.enum("type", ["text", "gif"]).defaultTo("text");
      t.string("gif_url").nullable().defaultTo(null);
      t.enum("receiver_type", ["post", "comment", "blog"]);
      t.string("receiver_id");
      t.string("receiver_userid");
      t.timestamp("created_on").defaultTo(db.fn.now());
    });
  }
});
db.schema.hasTable("all_likes").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("all_likes", function (t) {
      t.string("likeid").defaultTo(uid());
      t.string("userid");
      t.enum("receiver_type", ["post", "comment", "blog"]);
      t.string("receiver_id");
      t.string("receiver_userid");
      t.timestamp("created_on").defaultTo(db.fn.now());
    });
  }
});
db.schema.hasTable("all_dislikes").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("all_dislikes", function (t) {
      t.string("dislikeid").defaultTo(uid());
      t.string("userid");
      t.enum("receiver_type", ["post", "comment", "blog"]);
      t.string("receiver_id");
      t.string("receiver_userid");
      t.timestamp("created_on").defaultTo(db.fn.now());
    });
  }
});
db.schema.hasTable("socketids").then(function (exists) {
  if (!exists) {
    return db.schema.createTable("socketids", (t) => {
      t.string("name");
      t.string("id");
    });
  }
});
