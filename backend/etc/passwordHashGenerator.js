var bcrypt = require('bcryptjs');
bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash("engineering", salt, function(err, hash) {
        console.log(hash);
    });
});
