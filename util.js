var fs = require('fs');

module.exports = {
   /** 
         * creates a new file if it doesnt exist
         * returns true if file already existed
         * @param path path of the file
         * @param defaultValue String to write, if not type of string, will be stringified
         */
        touch: (path, defaultValue) => {
            try {
                fs.accessSync(path);
                return true;
            } catch (e) {
                var value = typeof defaultValue == 'string' ? 
                            defaultValue : 
                            JSON.stringify(defaultValue);
                fs.writeFileSync(path, value);
                return false;
            }
        }
};