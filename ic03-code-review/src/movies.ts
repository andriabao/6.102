
const movieToActors: Map<string, Set<string>> = new Map([
    ["Jurassic Park", new Set(["Laura Dern", "Sam Neill", "Samuel L. Jackson"])],
    ["Pulp Fiction", new Set(["Samuel L. Jackson", "John Travolta", "Uma Thurman"])],
    ["Michael Clayton", new Set(["George Clooney"])],
    ["Frozen", new Set(["Kristen Bell", "Veronica Mars"])],
    ["Fences", new Set(["Denzel Washington", "Viola Davis"])],
]);

const movieToDirectors: Map<string, Set<string>> = new Map(
    [["Pulp Fiction", new Set(["Quentin Tarantino"])], 
    ["Jurassic Park", new Set(["Steven Spielberg"])], 
    ["The Matrix", new Set(["Lana Wachowski", "Lilly Wachowski"])], 
    ["Fences", new Set(["Denzel Washington"])], 
]);

/**
 * 
 * @param person the name of the person to search for 
 * @returns an array of movies that the person has worked in
 */
function findFilmWithPerson(person:string, databaseToSearch: Map<string, Set<string>>) {
    const result: Array<string> = [];
    
    for (let movie of databaseToSearch.keys()) {
        let actorsList = databaseToSearch.get(movie);
        if (actorsList !== undefined && actorsList.has(person) && !result.includes(movie)) {
            result.push(movie);
        }
    }

    return result;
    
}

function main() {
    let person:string = "Samuel L. Jackson";
    let filmsActedIn: string[] = findFilmWithPerson(person, movieToActors);
    let filmsDirected: string[] = findFilmWithPerson(person, movieToDirectors)
    console.log(person + " has worked on " + filmsActedIn.concat(filmsDirected));
}


main();