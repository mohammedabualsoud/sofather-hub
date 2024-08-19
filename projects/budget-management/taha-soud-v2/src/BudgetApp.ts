import { DataSource, Repository } from "typeorm";
import { User } from "./entity/User.js";
import ormconfig from "./config/ormconfig.json" assert { type: "json" };
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

class BudgetApp {
  private static _instance: BudgetApp | null = null;
  private _dataSource: DataSource;
  private _userRepository: Repository<User>;

  private constructor(dataSource: DataSource) {
    this._dataSource = dataSource;
    this._userRepository = this._dataSource.getRepository(User);
  }

  public static async getInstance(): Promise<BudgetApp> {
    if (!BudgetApp._instance) {
      const dataSource = new DataSource({
        ...(ormconfig as PostgresConnectionOptions),
        entities: [User], // Explicitly include the User entity
      });

      await dataSource.initialize();
      BudgetApp._instance = new BudgetApp(dataSource);
    }
    return BudgetApp._instance;
  }

  public async addUser(
    userName: string,
    firstName: string,
    lastName: string,
    balance: number
  ): Promise<User> {
    const existingUser = await this._userRepository.findOneBy({ userName });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const user = this._userRepository.create({
      userName,
      firstName,
      lastName,
      balance,
    });
    await this._userRepository.save(user);
    return user;
  }

  public async deposit(userName: string, amount: number): Promise<void> {
    const user = await this._userRepository.findOneBy({ userName });
    if (!user) {
      throw new Error("User not found");
    }
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }
    user.balance += amount;
    await this._userRepository.save(user);
  }

  public async sendMoney(
    fromUser: string,
    toUser: string,
    amount: number
  ): Promise<void> {
    const fromUserEntity = await this._userRepository.findOneBy({
      userName: fromUser,
    });
    const toUserEntity = await this._userRepository.findOneBy({
      userName: toUser,
    });
    if (!fromUserEntity) {
      throw new Error("Sender not found");
    }
    if (!toUserEntity) {
      throw new Error("Receiver not found");
    }
    if (amount <= 0) {
      throw new Error("Invalid amount");
    }
    if (fromUserEntity.balance < amount) {
      throw new Error("Insufficient balance");
    }

    fromUserEntity.balance -= amount;
    toUserEntity.balance += amount;

    await this._userRepository.save(fromUserEntity);
    await this._userRepository.save(toUserEntity);
  }

  public async getMostRichUsers(n = 3): Promise<User[]> {
    const users = await this._userRepository.find({
      order: { balance: "DESC" },
      take: n,
    });
    return users;
  }

  public async getUsers(): Promise<User[]> {
    const users = await this._userRepository.find();
    return users;
  }

  public async resetUsers(): Promise<void> {
    await this._userRepository.clear();
  }
}

export default BudgetApp;
