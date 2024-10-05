const AyahFormatting = require('./Tables/ayahFormattingTable');

async function hasMistake(studentId, courseId, surah_ayah){
    let [surah, verse] = surah_ayah.split(":").map(Number);

    try {
        const result = await AyahFormatting.findOne({
            where: {
                studentId: studentId,
                courseId: courseId,
                surahNumber: surah,
                ayahNumber: verse
            },
            attributes: [
                "mistakes"
            ],
        });
        return result ? result.mistakes : [];
    } catch (err) {
        console.error(err)
    }
}

async function addMistake(studentId, courseId, surahNumber, ayahNumber, newMistakes){
    try{
        console.log("_____DEBUG 12_____");
        console.log(studentId, courseId, surahNumber, ayahNumber, newMistakes);
        const result = await AyahFormatting.findOne({
            where: {
                studentId: studentId,
                courseId: courseId,
                surahNumber: surahNumber,
                ayahNumber: ayahNumber
            }
        });
        console.log(result);

        if (result) {
            // Merge existing mistakes with new mistakes
            let existingMistakes = result.mistakes || [];

            result.mistakes =  [...new Set([...existingMistakes, ...newMistakes])];
            await result.save();
            console.log(`Successfully added mistakes for ${surahNumber}:${ayahNumber}`);
        } else {
            await AyahFormatting.create({
                studentId: studentId,
                courseId: courseId,
                surahNumber: surahNumber,
                ayahNumber: ayahNumber,
                isBookmarked: 0,
                mistakes: newMistakes,
            });
            console.log(`Successfully created and added mistakes for ${surahNumber}:${ayahNumber}`);
        }
    } catch (err){
        console.error(err);
    }
}


async function removeMistake(studentId, courseId, surahNumber, ayahNumber, indexesToRemove) {
    console.log("_____DEBUG 12_____", studentId, courseId, surahNumber, ayahNumber, indexesToRemove);
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
            let existingMistakes = result.mistakes || [];
            // Filter out the indexes to remove
            let updatedMistakes = existingMistakes.filter(index => !indexesToRemove.includes(index));

            result.mistakes = updatedMistakes || [];
            await result.save();
            console.log(`Successfully removed mistakes for ${surahNumber}:${ayahNumber}`);
        } else {
            console.log(`No mistakes found for ${surahNumber}:${ayahNumber} to remove.`);
        }
    } catch (err) {
        console.error(err);
    }
}

module.exports = { hasMistake, addMistake, removeMistake };