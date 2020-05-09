const mongoose = require('../database');

const FotoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    key: String,
    tamanho: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    evento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evento',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

FotoSchema.pre("save", function() {
    if (!this.url) {
      this.url = `${process.env.APP_URL}/files/${this.key}`;
    }
  });
  
  FotoSchema.pre("remove", function() {
    if (process.env.STORAGE_TYPE === "s3") {
      return s3
        .deleteObject({
          Bucket: process.env.BUCKET_NAME,
          Key: this.key
        })
        .promise()
        .then(response => {
          console.log(response.status);
        })
        .catch(response => {
          console.log(response.status);
        });
    } else {
      return promisify(fs.unlink)(
        path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
      );
    }
  });

const Foto = mongoose.model('Foto', FotoSchema);

module.exports = Foto;