import User from './User.js';
import readlineSync from 'readline-sync';

let stop = false;

while (!stop) {
    console.clear();
    console.log('\t\t\t Welcome to Budget Management !');
    console.log('-----------------------------------------------------------------------------');
    console.log('1. Add User');
    console.log('2. Deposit Money');
    console.log('3. Transfer Money');
    console.log('4. View User Information');
    console.log('5. Exit');
    console.log('-----------------------------------------------------------------------------');

    const choice = readlineSync.question('Please choose an option (1-5): ');

    switch (choice) {
        case '1':
            console.clear();
            console.log('--- Add User ---');
            const username = readlineSync.question('Enter Username: ');
            const fname = readlineSync.question('Enter First Name: ');
            const lname = readlineSync.question('Enter Last Name: ');
            new User(username, fname, lname);
            console.log('User added successfully!');
            readlineSync.question('Press Enter to continue...');
            break;

        case '2':
            console.clear();
            console.log('--- Deposit Money ---');
            const depositUsername = readlineSync.question('Enter Username: ');
            const depositAmount = parseFloat(readlineSync.question('Enter Amount: '));
            const user = User.users.get(depositUsername);
            if (user) {
                user.deposit(depositAmount);
                console.log('Deposit successful!');
            } else {
                console.log('User not found!');
            }
            readlineSync.question('Press Enter to continue...');
            break;

        case '3':
            console.clear();
            console.log('--- Transfer Money ---');
            const senderUsername = readlineSync.question('Enter Sender\'s Username: ');
            const receiverUsername = readlineSync.question('Enter Receiver\'s Username: ');
            const transferAmount = parseFloat(readlineSync.question('Enter Amount: '));
            const sender = User.users.get(senderUsername);
            const receiver = User.users.get(receiverUsername);
            if (sender && receiver) {
                sender.transfer(receiverUsername, transferAmount);
                console.log('Transfer successful!');
            } else {
                console.log('Sender or receiver not found!');
            }
            readlineSync.question('Press Enter to continue...');
            break;

        case '4':
            console.clear();
            console.log('--- View User Information ---');
            const viewUsername = readlineSync.question('Enter Username: ');
            const viewUser = User.users.get(viewUsername);
            if (viewUser) {
                console.log('Username:', viewUser.getUsername());
                console.log('First Name:', viewUser.getFirstname());
                console.log('Last Name:', viewUser.getLastname());
                console.log('Balance:', viewUser.getBalance());
            } else {
                console.log('User not found!');
            }
            readlineSync.question('Press Enter to continue...');
            break;

        case '5':
            console.clear();
            console.log('Thank you for using Budget Management! Goodbye!');
            stop = true;
            break;

        default:
            console.clear();
            console.log('Invalid choice. Please choose a valid option.');
            readlineSync.question('Press Enter to continue...');
            break;
    }
}

