console.log('********Q1*******')
class User {
    public id: number;
    public name: string;
    public email: string;
    private password: string;
    protected phone: string;
    private age: number;

    constructor(
        id: number,
        name: string,
        email: string,
        password: string,
        phone: string,
        age: number
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.age = age;
    }

    // Age validation
    public set age(value: number) {
        if (!Number.isInteger(value) || value < 18 || value > 60) {
            throw new Error("Age must be between 18 and 60");
        }
        this._age = value;
    }

    public get age(): number {
        return this._age;

    }

    // Display user information
    public displayInfo(): void {
        console.log("User Information:");
        console.log(`ID: ${this.id}`);
        console.log(`Name: ${this.name}`);
        console.log(`Email: ${this.email}`);
        console.log(`Phone: ${this.phone}`);
        console.log(`Age: ${this.age}`);
        console.log("Password: ********");
    }
    // Aggregation
    private notebooks: NoteBook[] = [];

    public addNotebook(notebook: NoteBook): void {
        this.notebooks.push(notebook);
    }

    public removeNotebook(notebook: NoteBook): void {
        const index = this.notebooks.indexOf(notebook);

        if (index !== -1) {
            this.notebooks.splice(index, 1);
        }
    }

    public displayNotebooks(): void {
        this.notebooks.forEach(notebook => {
            notebook.displayNotes();
        });
    }
}

// Create a user
const user1 = new User(
    1,
    "Toqa",
    "toqa@example.com",
    "123456",
    "01012345678",
    25
);

user1.displayInfo();

console.log('*******Q2*******')

class Admin extends User {
    public manageNotes(note: string): void {
        console.log(`${this.name} is managing note: ${note}`);
    }
}

// Create Admin object
const admin1 = new Admin(
    2,
    "maha",
    "maha@example.com",
    "012345",
    "01012345678",
    30
);

// Inherited method from User
admin1.displayInfo();

// Admin method
admin1.manageNotes("Review notes");

console.log('******Q3*****')

class Note {
    public id: number;
    public title: string;
    public content: string;
    public userId: number;
    public author: User;

    constructor(
        id: number,
        title: string,
        content: string,
        author: User
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
        this.userId = author.id;
    }

    // Preview note content
    public preview(): string {
        return this.content.length > 50
            ? this.content.substring(0, 50) + "..."
            : this.content;
    }

    // Display note author
    public displayAuthor(): void {
        console.log(`Author: ${this.author.name}`);
    }
}
console.log('******Q4******')

class NoteBook {
    private notes: Note[] = [];

    // Add a new note
    public addNote(
        id: number,
        title: string,
        content: string,
        author: User
    ): void {
        const note = new Note(id, title, content, author);
        this.notes.push(note);
        console.log("Note added successfully");
    }

    // Remove a note by ID
    public removeNote(id: number): void {
        const index = this.notes.findIndex(note => note.id === id);

        if (index !== -1) {
            this.notes.splice(index, 1);
            console.log("Note removed successfully");
        } else {
            console.log("Note not found");
        }
    }

    // Display all notes
    public displayNotes(): void {
        this.notes.forEach(note => {
            console.log(`ID: ${note.id}`);
            console.log(`Title: ${note.title}`);
            console.log(`Preview: ${note.preview()}`);
        });
    }
}

// Create a notebook
const notebook = new NoteBook();

// Add notes
notebook.addNote(1, "JavaScript", "JavaScript is a programming language", 1);
notebook.addNote(2, "TypeScript", "TypeScript adds static typing to JavaScript", 1);

// Display notes
notebook.displayNotes();

// Remove a note
notebook.removeNote(1);

console.log('******Q5*****')
const author1 = new User(
    3,
    "Sara",
    "sara@example.com",
    "123456",
    "01012345678",
    22
);

// Create a note with an author
const note3 = new Note(
    3,
    "OOP Notes",
    "Learning Association in TypeScript",
    author1
);

// Display note information
console.log(note3.title);
console.log(note3.preview());
note3.displayAuthor();

const user = new User(
    1,
    "yara",
    "yara@example.com",
    "112345",
    "01012345678",
    23
);

// Create notebooks
const notebook1 = new NoteBook();
const notebook2 = new NoteBook();

// Add notes
notebook1.addNote(
    1,
    "JavaScript",
    "Learn JavaScript basics",
    1
);

notebook2.addNote(
    2,
    "TypeScript",
    "Learn TypeScript OOP",
    1
);

// Aggregation
user.addNotebook(notebook1);
user.addNotebook(notebook2);

// Display user's notebooks
user.displayNotebooks();

// Remove notebook from user
user.removeNotebook(notebook1);

// Notebook still exists
notebook1.displayNotes();

console.log('******Q6*****')



// Display note information
console.log(note3.title);
console.log(note3.preview());
note3.displayAuthor();

console.log('*******Q7******')

class Storage<T> {
    private items: T[] = [];

    // Add item
    public addItem(item: T): void {
        this.items.push(item);
        console.log("Item added successfully");
    }

    // Remove item
    public removeItem(item: T): void {
        const index = this.items.indexOf(item);

        if (index !== -1) {
            this.items.splice(index, 1);
            console.log("Item removed successfully");
        } else {
            console.log("Item not found");
        }
    }

    // Get all items
    public getAllItems(): T[] {
        return [...this.items];
    }
}
const numberStorage = new Storage<number>();

// Add items
numberStorage.addItem(10);
numberStorage.addItem(20);
numberStorage.addItem(30);

// Display all items
console.log(numberStorage.getAllItems());

// Remove item
numberStorage.removeItem(20);

// Display items after removal
console.log(numberStorage.getAllItems());