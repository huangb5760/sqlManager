const path = require('path');
const low = require('lowdb');
const fs = require('graceful-fs');
const Base = require('lowdb/adapters/Base');

const readFile = fs.readFileSync
const writeFile = fs.writeFileSync

class FileSync extends Base {
  read() {
    if (fs.existsSync(this.source)) {
      try {
        const data = readFile(this.source, 'utf-8').trim()
        // Handle blank file
        return data ? this.deserialize(data) : this.defaultValue
      } catch (e) {
        if (e instanceof SyntaxError) {
          e.message = `Malformed JSON in file: ${this.source}\n${e.message}`
        }
        throw e
      }
    } else {
      return this.defaultValue
    }
  }

  write(data) {
    return true;
  }
}

const db = low(new FileSync(path.join(process.cwd(), 'blog.x.json')));

export default (req, res) => {
	const posts = [] //db.defaults({ blog: [] }).get('blog').value()
	res.json({ 
		name: 'murph', 
		email: 'murphyl@outlook.com', 
		posts, 
		path: __dirname,
		l: process.cwd()
	})
}