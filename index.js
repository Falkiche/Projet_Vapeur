const getUsers = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.5;
            if (success) {
                resolve([
                    { id: 1, nom: "Test1" },
                    { id: 2, nom: "Test2" },
                    { id: 3, nom: "Test4" },
                    { id: 4, nom: "Test" },
                    { id: 5, nom: "Lancelot" },
                    { id: 6, nom: "Merlin" },
                ]);
            } else {
                reject("Erreur lors de l'obtention des utilisateurs.");
            }
        }, 2000);
    });
};

getUsers()
    .then((users) => {
        console.log(users);
    })
    .catch((error) => {
        console.error(error);
    });