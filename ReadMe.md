server.js
let savedImagePath = "";
//Downloading img

if (img && (img.startsWith("http://") || img.startsWith("https://"))) {
try {
const response = await axios.get(img, { responseType: "stream" });

      //if url provided doesn't work or provide an image
      const contentType = response.headers["content-type"];
      if (!contentType.startsWith("image/")) {
        throw new Error("Provided URL is not an image");
      }

      const fileName = `${Date.now()}-${path.basename(img)}`;
      console.log(fileName);

      const mediaDir = path.join(__dirname, "media");
      const savePath = path.join(__dirname, "media", fileName);
      console.log(savePath);

      // Create the media folder if it doesn't exist
      if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir);
      }

      const writer = fs.createWriteStream(savePath);
      response.data.pipe(writer);

      //waits for image to download
      await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      savedImagePath = `/media/${fileName}`;
    } catch (err) {
      console.error("Image download failed:", err.message);
      savedImagePath = "/media/default.jpg";
    }

}
