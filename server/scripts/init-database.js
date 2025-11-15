// Création de la base de données
db = db.getSiblingDB('schoola_taawon');

// Création des collections avec validation
db.createCollection('users', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["username", "email", "password", "city"],
         properties: {
            username: {
               bsonType: "string",
               minLength: 3,
               maxLength: 30
            },
            email: {
               bsonType: "string",
               pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            password: {
               bsonType: "string",
               minLength: 6
            },
            city: {
               bsonType: "string"
            },
            profilePicture: {
               bsonType: "string"
            }
         }
      }
   }
});

db.createCollection('listings', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["title", "description", "category", "condition", "educationLevel", "city", "owner"],
         properties: {
            title: {
               bsonType: "string",
               minLength: 3,
               maxLength: 100
            },
            description: {
               bsonType: "string",
               minLength: 10,
               maxLength: 1000
            },
            category: {
               enum: ["livres", "cahiers", "sacs", "calculatrices", "materiel_dessin", "autres"]
            },
            condition: {
               enum: ["neuf", "excellent", "bon", "correct"]
            },
            educationLevel: {
               enum: ["primaire", "college", "lycee"]
            },
            city: {
               bsonType: "string"
            },
            images: {
               bsonType: "array",
               items: {
                  bsonType: "string"
               }
            },
            status: {
               enum: ["disponible", "en_echange", "echange_termine"]
            },
            owner: {
               bsonType: "objectId"
            }
         }
      }
   }
});

db.createCollection('conversations', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["participants", "listing"],
         properties: {
            participants: {
               bsonType: "array",
               minItems: 2,
               maxItems: 2,
               items: {
                  bsonType: "objectId"
               }
            },
            listing: {
               bsonType: "objectId"
            },
            lastMessage: {
               bsonType: "objectId"
            }
         }
      }
   }
});

db.createCollection('messages', {
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: ["conversation", "sender", "content"],
         properties: {
            conversation: {
               bsonType: "objectId"
            },
            sender: {
               bsonType: "objectId"
            },
            content: {
               bsonType: "string",
               minLength: 1,
               maxLength: 1000
            },
            readBy: {
               bsonType: "array",
               items: {
                  bsonType: "objectId"
               }
            }
         }
      }
   }
});

// Création des index
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.listings.createIndex({ "title": "text", "description": "text" });
db.listings.createIndex({ "category": 1, "city": 1, "status": 1 });
db.conversations.createIndex({ "participants": 1 });
db.messages.createIndex({ "conversation": 1, "createdAt": -1 });

// Création d'un utilisateur administrateur
db.createUser({
   user: "schoola_admin",
   pwd: "ChangeThisPassword123!",
   roles: [
      { role: "readWrite", db: "schoola_taawon" },
      { role: "dbAdmin", db: "schoola_taawon" }
   ]
});

// Données de test pour le développement
db.users.insertOne({
   username: "test_user",
   email: "test@schoola-taawon.com",
   password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY.5Z2PB.oW.f/", // "password123"
   city: "Tunis",
   profilePicture: ""
});

// Message de confirmation
print("Base de données initialisée avec succès!");
print("Utilisateur admin créé - N'oubliez pas de changer le mot de passe!");
print("Un utilisateur de test a été créé pour le développement.");