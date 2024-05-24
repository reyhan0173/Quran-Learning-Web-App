

// Use `Quran_Explorer`.`ayahFormatting` table

const AyahFormatting = require('./ayahFormattingTable');

// isBookmarked(studentId, courseId, surahNumber, ayahNumber) returns 1 if bookmarked or 0 otherwise

// isBookmarked(studentId, courseId, surahNumber, ayahNumber) returns 1 if successfully added and console.logs "Successfully added a bookmark at {surahNumber:ayahNumber}" or logs the error and returns 0

// removeBookmark(studentId, courseId, surahNumber, ayahNumber) returns 1 if successfully removed and console.logs "Successfully removed the bookmark at {surahNumber:ayahNumber}" or logs the error and returns 0
async function hasMistake(surah_ayah){
    let [surah, verse] = surah_ayah.split(":").map(Number);
    
    try {
        const result = await AyahFormatting.findOne({
            where:{
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

module.exports = hasMistake;