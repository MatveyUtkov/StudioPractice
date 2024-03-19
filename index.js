const { MongoClient } = require("mongodb");
async function run(){
    const uri="mongodb+srv://deadpoolmillioner:XxiAuNWdwi6VJSH0@studio.azk6h89.mongodb.net/?retryWrites=true&w=majority&appName=Studio"
    const client = new MongoClient(uri);
    await client.connect()
    const dbName="Booking"
    const collectionName="StudioBooking"
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const booking=[
        {
            mail:"blabla@mail.ru",
            date:"10/10/10",
            job:"video"
        }
    ];
    try {
        const insertManyResult = await collection.insertMany(booking);
        console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
    } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    }
    const findQuery = { prepTimeInMinutes: { $lt: 45 } };

    try {
        const cursor = await collection.find(findQuery).sort({ name: 1 });
        await cursor.forEach(recipe => {
            console.log(`${recipe.name} has ${recipe.ingredients.length} ingredients and takes ${recipe.prepTimeInMinutes} minutes to make.`);
        });
        console.log();
    } catch (err) {
        console.error(`Something went wrong trying to find the documents: ${err}\n`);
    }

    const findOneQuery = { ingredients: "potato" };

    try {
        const findOneResult = await collection.findOne(findOneQuery);
        if (findOneResult === null) {
            console.log("Couldn't find any recipes that contain 'potato' as an ingredient.\n");
        } else {
            console.log(`Found a recipe with 'potato' as an ingredient:\n${JSON.stringify(findOneResult)}\n`);
        }
    } catch (err) {
        console.error(`Something went wrong trying to find one document: ${err}\n`);
    }

    const updateDoc = { $set: { prepTimeInMinutes: 72 } };

    const updateOptions = { returnOriginal: false };

    try {
        const updateResult = await collection.findOneAndUpdate(
            findOneQuery,
            updateDoc,
            updateOptions,
        );
        console.log(`Here is the updated document:\n${JSON.stringify(updateResult.value)}\n`);
    } catch (err) {
        console.error(`Something went wrong trying to update one document: ${err}\n`);
    }

    const deleteQuery = { name: { $in: ["elotes", "fried rice"] } };
    try {
        const deleteResult = await collection.deleteMany(deleteQuery);
        console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
    } catch (err) {
        console.error(`Something went wrong trying to delete documents: ${err}\n`);
    }
    await client.close();
}
run().catch(console.dir);