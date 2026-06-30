const musicModel = require('../models/music.model');
const { uploadFile } = require('../services/storage.service');
const albumModel = require('../models/album.model');
const jwt = require('jsonwebtoken');

const createMusic = async (req, res) => {

    const { title } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'Music file is required' });
    }

        const result = await uploadFile(file.buffer);

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user.id
        });
        return res.status(201).json({
            message: 'Music track created successfully',
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });

}

const createAlbum = async (req, res) => {
    
        const { title, musics } = req.body;
        const album = await albumModel.create({
            title,
            artist: req.user.id,
            musics: musics
        });
        return res.status(201).json({
            message: 'Album created successfully',
            album: {
                id: album._id,
                title: album.title,
                musics: album.musics,
                artist: album.artist
            }
        });
}

const getAllMusics = async (req, res) => {
    const musics = await musicModel.find().limit(10).populate("artist", "username email");
    return res.status(200).json({ 
        message: "Musics fetched successfully",
        musics: musics 
    });
}

const getAllAlbums = async (req, res) => {
    const albums = await albumModel.find().select("title artist").populate("artist", "username email");
    return res.status(200).json({
        message: "Album fetched successfully",
        albums: albums 
    })
}

const getAlbumById = async (req, res) => {
    const albumId = req.params.albumId;
    const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics");
    return res.status(200).json({
        message: "Album fetched successfully",
        album: album
    })
}

module.exports = {
    createMusic,
    createAlbum,
    getAllMusics,
    getAllAlbums,
    getAlbumById
};