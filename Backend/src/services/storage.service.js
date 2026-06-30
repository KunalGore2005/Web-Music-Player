const { ImageKit, toFile } = require("@imagekit/nodejs");

const ImageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

const uploadFile = async (fileBuffer) => {
    const fileName =`music_${Date.now()}`;
    const uploadableFile = await toFile(fileBuffer, fileName);

    const result = await ImageKitClient.files.upload({
        file: uploadableFile,
        fileName,
        folder: '/spotify/music'
    });
    return result;
}

module.exports = {
    uploadFile
};