
const AyahFormatting = require('./ayahFormattingTable');

async function hasMistake(surah_ayah){
    let [surah, verse] = surah_ayah.split(":").map(Number);
    
    try {
        const result = await AyahFormatting.findOne({
            where: {
                surahNumber: surah,
                ayahNumber: verse
            },
            attributes: [
                "mistakes"
            ],
        });
        return result ? result.mistakes : null;
    } catch (err) {
        console.error(err)
    }
}

module.exports = { hasMistake };
