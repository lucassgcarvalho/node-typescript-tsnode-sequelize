import { default as mongodb, CommandCursor } from 'mongodb';


let MongoClient = mongodb.MongoClient;


export class MongoDb {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     * mongodb+srv://matrix:neoisalive@<your-cluster-url>/test?retryWrites=true&w=majority
     */
    uri: string = "mongodb+srv://matrix:neoisalive@cluster0.k58hy.mongodb.net/matrix?retryWrites=true&w=majority";
    // uri: string = "mongodb://localhost:27017/matrix";
    // uri: string = "mongodb://mongodb-standalone-0.database:27017/matrix";
    
    dataBase!: mongodb.Db;
    client!: mongodb.MongoClient;
    static ObjectId = mongodb.ObjectId;

    constructor(uriParam?: string){
        this.conf(uriParam).then( (db) =>{ this.dataBase = db }, (err) =>{throw err })
            .then( () => {})
            .catch( (error) => { throw error });
    }


    getDataBase() {
        return this.dataBase;
    }

    async listDatabases(client: mongodb.MongoClient){
        let databasesList = await client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach( (db: any) => console.log(` - ${db.name}`));
    };

    async conf(uriParam?: string){
        try {
            this.client = await MongoClient.connect((uriParam ? uriParam: this.uri), { useNewUrlParser: true, useUnifiedTopology: true });
            this.listDatabases(this.client);
            return this.dataBase = this.client.db();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
}