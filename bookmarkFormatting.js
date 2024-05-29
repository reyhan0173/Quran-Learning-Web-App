// Use `Quran_Explorer`.`ayahFormatting` table
const AyahFormatting = require('./ayahFormattingTable');

async function addBookmark(studentId, courseId, surahNumber, ayahNumber) {
    try {
        const result = await AyahFormatting.findOne({
            where: {
                studentId: studentId,
                courseId: courseId,
                surahNumber: surahNumber,
                ayahNumber: ayahNumber
            }
        });

        if (result) {
            result.isBookmarked = 1;
            await result.save();  // save the updated result to the database
            console.log(`Successfully added the bookmark at ${surahNumber}:${ayahNumber}`);
            return 1;  // successfully added
        } else {
            await AyahFormatting.create({
                studentId: studentId,
                courseId: courseId,
                surahNumber: surahNumber,
                ayahNumber: ayahNumber,
                isBookmarked: 1
            });
            console.log(`Successfully added the bookmark at ${surahNumber}:${ayahNumber}`);
            return 1;  // successfully created and added
        }
    } catch (err) {
        console.error(err);
        return 0;  // return 0 on error
    }
}

async function removeBookmark(studentId, courseId, surahNumber, ayahNumber) {
    try {
        const result = await AyahFormatting.findOne({
            where: {
                studentId: studentId,
                courseId: courseId,
                surahNumber: surahNumber,
                ayahNumber: ayahNumber
            }
        });

        if (result) {
            result.isBookmarked = 0;
            await result.save();  // save the updated result to the database
            console.log(`Successfully removed the bookmark at ${surahNumber}:${ayahNumber}`);
            return 1;  // successfully removed
        } else {
            console.log(`Bookmark not found at ${surahNumber}:${ayahNumber}`);
            return 1;  // bookmark not found
        }
    } catch (err) {
        console.error(err);
        return 0;  // return 0 on error
    }
}


async function isBookmarked(studentId, courseId, surahNumber, ayahNumber) {
    try {
        const result = await AyahFormatting.findOne({
            where: {
                studentId: studentId,
                courseId: courseId,
                surahNumber, surahNumber,
                ayahNumber: ayahNumber
            },
            attributes: [
                "isBookmarked"
            ]
        });

        // returns 1 if bookmarked or 0 otherwise
        return result && result.isBookmarked ? 1 : 0;
    } catch (err) {
        console.error(err)
        return 0;
    }
}

module.exports = { isBookmarked, addBookmark, removeBookmark };
