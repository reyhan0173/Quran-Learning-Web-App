
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

async function addMistake(surahNumber, ayahNumber, newMistakes){
    console.log('bieng added')
    try{
        const result = await AyahFormatting.findOne({
            where: {
                surahNumber: surahNumber,
                ayahNumber: ayahNumber
            }
        });

        if (result) {
            // Merge existing mistakes with new mistakes
            let existingMistakes = result.mistakes || [];
            let combinedMistakes = [...new Set([...existingMistakes, ...newMistakes])];

            result.mistakes = combinedMistakes;
            await result.save();
            console.log(`Successfully added mistakes for ${surahNumber}:${ayahNumber}`);
        } else {
            await AyahFormatting.create({
                surahNumber: surahNumber,
                ayahNumber: ayahNumber,
                mistakes: newMistakes,
            });
            console.log(`Successfully created and added mistakes for ${surahNumber}:${ayahNumber}`);
        }
    } catch (err){
        console.error(err);
    }
}

module.exports = { hasMistake, addMistake, };
