
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model Category
 * 
 */
export type Category = $Result.DefaultSelection<Prisma.$CategoryPayload>
/**
 * Model SubCategory
 * 
 */
export type SubCategory = $Result.DefaultSelection<Prisma.$SubCategoryPayload>
/**
 * Model SKU
 * 
 */
export type SKU = $Result.DefaultSelection<Prisma.$SKUPayload>
/**
 * Model Rack
 * 
 */
export type Rack = $Result.DefaultSelection<Prisma.$RackPayload>
/**
 * Model Shelf
 * 
 */
export type Shelf = $Result.DefaultSelection<Prisma.$ShelfPayload>
/**
 * Model Inventory
 * 
 */
export type Inventory = $Result.DefaultSelection<Prisma.$InventoryPayload>
/**
 * Model Transaction
 * 
 */
export type Transaction = $Result.DefaultSelection<Prisma.$TransactionPayload>
/**
 * Model Billing
 * 
 */
export type Billing = $Result.DefaultSelection<Prisma.$BillingPayload>
/**
 * Model Customer
 * 
 */
export type Customer = $Result.DefaultSelection<Prisma.$CustomerPayload>
/**
 * Model CompanySetting
 * 
 */
export type CompanySetting = $Result.DefaultSelection<Prisma.$CompanySettingPayload>
/**
 * Model Module
 * 
 */
export type Module = $Result.DefaultSelection<Prisma.$ModulePayload>
/**
 * Model Permission
 * 
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>
/**
 * Model SystemLog
 * 
 */
export type SystemLog = $Result.DefaultSelection<Prisma.$SystemLogPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Room: {
  Room1: 'Room1',
  Room2: 'Room2',
  Cabin: 'Cabin'
};

export type Room = (typeof Room)[keyof typeof Room]


export const Level: {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

export type Level = (typeof Level)[keyof typeof Level]


export const TxType: {
  INWARD: 'INWARD',
  OUTWARD: 'OUTWARD'
};

export type TxType = (typeof TxType)[keyof typeof TxType]


export const LogUser: {
  Admin: 'Admin',
  Manager: 'Manager',
  System: 'System',
  Operator1: 'Operator1',
  Operator2: 'Operator2'
};

export type LogUser = (typeof LogUser)[keyof typeof LogUser]


export const LogAction: {
  ConfigChanged: 'ConfigChanged',
  BackupCompleted: 'BackupCompleted',
  ScannedQRCode: 'ScannedQRCode',
  StartedConveyor: 'StartedConveyor',
  UpdatedSKUDetails: 'UpdatedSKUDetails',
  PlacedOnRack: 'PlacedOnRack',
  UserLogin: 'UserLogin',
  RemovedFromRack: 'RemovedFromRack',
  GeneratedInvoice: 'GeneratedInvoice',
  RackCapacityWarning: 'RackCapacityWarning',
  StoppedConveyor: 'StoppedConveyor',
  EmergencyStopActivated: 'EmergencyStopActivated',
  SensorActivated: 'SensorActivated',
  SensorDeactivated: 'SensorDeactivated',
  SensorActivationFailed: 'SensorActivationFailed',
  SensorDeactivationFailed: 'SensorDeactivationFailed',
  PLCCommunicationError: 'PLCCommunicationError'
};

export type LogAction = (typeof LogAction)[keyof typeof LogAction]


export const LogStatus: {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

export type LogStatus = (typeof LogStatus)[keyof typeof LogStatus]

}

export type Room = $Enums.Room

export const Room: typeof $Enums.Room

export type Level = $Enums.Level

export const Level: typeof $Enums.Level

export type TxType = $Enums.TxType

export const TxType: typeof $Enums.TxType

export type LogUser = $Enums.LogUser

export const LogUser: typeof $Enums.LogUser

export type LogAction = $Enums.LogAction

export const LogAction: typeof $Enums.LogAction

export type LogStatus = $Enums.LogStatus

export const LogStatus: typeof $Enums.LogStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs>;

  /**
   * `prisma.category`: Exposes CRUD operations for the **Category** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Categories
    * const categories = await prisma.category.findMany()
    * ```
    */
  get category(): Prisma.CategoryDelegate<ExtArgs>;

  /**
   * `prisma.subCategory`: Exposes CRUD operations for the **SubCategory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SubCategories
    * const subCategories = await prisma.subCategory.findMany()
    * ```
    */
  get subCategory(): Prisma.SubCategoryDelegate<ExtArgs>;

  /**
   * `prisma.sKU`: Exposes CRUD operations for the **SKU** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SKUS
    * const sKUS = await prisma.sKU.findMany()
    * ```
    */
  get sKU(): Prisma.SKUDelegate<ExtArgs>;

  /**
   * `prisma.rack`: Exposes CRUD operations for the **Rack** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Racks
    * const racks = await prisma.rack.findMany()
    * ```
    */
  get rack(): Prisma.RackDelegate<ExtArgs>;

  /**
   * `prisma.shelf`: Exposes CRUD operations for the **Shelf** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Shelves
    * const shelves = await prisma.shelf.findMany()
    * ```
    */
  get shelf(): Prisma.ShelfDelegate<ExtArgs>;

  /**
   * `prisma.inventory`: Exposes CRUD operations for the **Inventory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Inventories
    * const inventories = await prisma.inventory.findMany()
    * ```
    */
  get inventory(): Prisma.InventoryDelegate<ExtArgs>;

  /**
   * `prisma.transaction`: Exposes CRUD operations for the **Transaction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transactions
    * const transactions = await prisma.transaction.findMany()
    * ```
    */
  get transaction(): Prisma.TransactionDelegate<ExtArgs>;

  /**
   * `prisma.billing`: Exposes CRUD operations for the **Billing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Billings
    * const billings = await prisma.billing.findMany()
    * ```
    */
  get billing(): Prisma.BillingDelegate<ExtArgs>;

  /**
   * `prisma.customer`: Exposes CRUD operations for the **Customer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Customers
    * const customers = await prisma.customer.findMany()
    * ```
    */
  get customer(): Prisma.CustomerDelegate<ExtArgs>;

  /**
   * `prisma.companySetting`: Exposes CRUD operations for the **CompanySetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CompanySettings
    * const companySettings = await prisma.companySetting.findMany()
    * ```
    */
  get companySetting(): Prisma.CompanySettingDelegate<ExtArgs>;

  /**
   * `prisma.module`: Exposes CRUD operations for the **Module** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Modules
    * const modules = await prisma.module.findMany()
    * ```
    */
  get module(): Prisma.ModuleDelegate<ExtArgs>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permission.findMany()
    * ```
    */
  get permission(): Prisma.PermissionDelegate<ExtArgs>;

  /**
   * `prisma.systemLog`: Exposes CRUD operations for the **SystemLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemLogs
    * const systemLogs = await prisma.systemLog.findMany()
    * ```
    */
  get systemLog(): Prisma.SystemLogDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Role: 'Role',
    Category: 'Category',
    SubCategory: 'SubCategory',
    SKU: 'SKU',
    Rack: 'Rack',
    Shelf: 'Shelf',
    Inventory: 'Inventory',
    Transaction: 'Transaction',
    Billing: 'Billing',
    Customer: 'Customer',
    CompanySetting: 'CompanySetting',
    Module: 'Module',
    Permission: 'Permission',
    SystemLog: 'SystemLog'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "role" | "category" | "subCategory" | "sKU" | "rack" | "shelf" | "inventory" | "transaction" | "billing" | "customer" | "companySetting" | "module" | "permission" | "systemLog"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      Category: {
        payload: Prisma.$CategoryPayload<ExtArgs>
        fields: Prisma.CategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findFirst: {
            args: Prisma.CategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          findMany: {
            args: Prisma.CategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          create: {
            args: Prisma.CategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          createMany: {
            args: Prisma.CategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>[]
          }
          delete: {
            args: Prisma.CategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          update: {
            args: Prisma.CategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          deleteMany: {
            args: Prisma.CategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CategoryPayload>
          }
          aggregate: {
            args: Prisma.CategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCategory>
          }
          groupBy: {
            args: Prisma.CategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<CategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.CategoryCountArgs<ExtArgs>
            result: $Utils.Optional<CategoryCountAggregateOutputType> | number
          }
        }
      }
      SubCategory: {
        payload: Prisma.$SubCategoryPayload<ExtArgs>
        fields: Prisma.SubCategoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SubCategoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SubCategoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>
          }
          findFirst: {
            args: Prisma.SubCategoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SubCategoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>
          }
          findMany: {
            args: Prisma.SubCategoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>[]
          }
          create: {
            args: Prisma.SubCategoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>
          }
          createMany: {
            args: Prisma.SubCategoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SubCategoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>[]
          }
          delete: {
            args: Prisma.SubCategoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>
          }
          update: {
            args: Prisma.SubCategoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>
          }
          deleteMany: {
            args: Prisma.SubCategoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SubCategoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SubCategoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SubCategoryPayload>
          }
          aggregate: {
            args: Prisma.SubCategoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSubCategory>
          }
          groupBy: {
            args: Prisma.SubCategoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<SubCategoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.SubCategoryCountArgs<ExtArgs>
            result: $Utils.Optional<SubCategoryCountAggregateOutputType> | number
          }
        }
      }
      SKU: {
        payload: Prisma.$SKUPayload<ExtArgs>
        fields: Prisma.SKUFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SKUFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SKUFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>
          }
          findFirst: {
            args: Prisma.SKUFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SKUFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>
          }
          findMany: {
            args: Prisma.SKUFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>[]
          }
          create: {
            args: Prisma.SKUCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>
          }
          createMany: {
            args: Prisma.SKUCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SKUCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>[]
          }
          delete: {
            args: Prisma.SKUDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>
          }
          update: {
            args: Prisma.SKUUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>
          }
          deleteMany: {
            args: Prisma.SKUDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SKUUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SKUUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SKUPayload>
          }
          aggregate: {
            args: Prisma.SKUAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSKU>
          }
          groupBy: {
            args: Prisma.SKUGroupByArgs<ExtArgs>
            result: $Utils.Optional<SKUGroupByOutputType>[]
          }
          count: {
            args: Prisma.SKUCountArgs<ExtArgs>
            result: $Utils.Optional<SKUCountAggregateOutputType> | number
          }
        }
      }
      Rack: {
        payload: Prisma.$RackPayload<ExtArgs>
        fields: Prisma.RackFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RackFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RackFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          findFirst: {
            args: Prisma.RackFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RackFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          findMany: {
            args: Prisma.RackFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>[]
          }
          create: {
            args: Prisma.RackCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          createMany: {
            args: Prisma.RackCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RackCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>[]
          }
          delete: {
            args: Prisma.RackDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          update: {
            args: Prisma.RackUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          deleteMany: {
            args: Prisma.RackDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RackUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.RackUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RackPayload>
          }
          aggregate: {
            args: Prisma.RackAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRack>
          }
          groupBy: {
            args: Prisma.RackGroupByArgs<ExtArgs>
            result: $Utils.Optional<RackGroupByOutputType>[]
          }
          count: {
            args: Prisma.RackCountArgs<ExtArgs>
            result: $Utils.Optional<RackCountAggregateOutputType> | number
          }
        }
      }
      Shelf: {
        payload: Prisma.$ShelfPayload<ExtArgs>
        fields: Prisma.ShelfFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ShelfFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ShelfFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>
          }
          findFirst: {
            args: Prisma.ShelfFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ShelfFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>
          }
          findMany: {
            args: Prisma.ShelfFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>[]
          }
          create: {
            args: Prisma.ShelfCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>
          }
          createMany: {
            args: Prisma.ShelfCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ShelfCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>[]
          }
          delete: {
            args: Prisma.ShelfDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>
          }
          update: {
            args: Prisma.ShelfUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>
          }
          deleteMany: {
            args: Prisma.ShelfDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ShelfUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ShelfUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ShelfPayload>
          }
          aggregate: {
            args: Prisma.ShelfAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateShelf>
          }
          groupBy: {
            args: Prisma.ShelfGroupByArgs<ExtArgs>
            result: $Utils.Optional<ShelfGroupByOutputType>[]
          }
          count: {
            args: Prisma.ShelfCountArgs<ExtArgs>
            result: $Utils.Optional<ShelfCountAggregateOutputType> | number
          }
        }
      }
      Inventory: {
        payload: Prisma.$InventoryPayload<ExtArgs>
        fields: Prisma.InventoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InventoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InventoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findFirst: {
            args: Prisma.InventoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InventoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          findMany: {
            args: Prisma.InventoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          create: {
            args: Prisma.InventoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          createMany: {
            args: Prisma.InventoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InventoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>[]
          }
          delete: {
            args: Prisma.InventoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          update: {
            args: Prisma.InventoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          deleteMany: {
            args: Prisma.InventoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InventoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.InventoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InventoryPayload>
          }
          aggregate: {
            args: Prisma.InventoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInventory>
          }
          groupBy: {
            args: Prisma.InventoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<InventoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.InventoryCountArgs<ExtArgs>
            result: $Utils.Optional<InventoryCountAggregateOutputType> | number
          }
        }
      }
      Transaction: {
        payload: Prisma.$TransactionPayload<ExtArgs>
        fields: Prisma.TransactionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransactionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransactionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findFirst: {
            args: Prisma.TransactionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransactionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          findMany: {
            args: Prisma.TransactionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          create: {
            args: Prisma.TransactionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          createMany: {
            args: Prisma.TransactionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransactionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>[]
          }
          delete: {
            args: Prisma.TransactionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          update: {
            args: Prisma.TransactionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          deleteMany: {
            args: Prisma.TransactionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransactionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TransactionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransactionPayload>
          }
          aggregate: {
            args: Prisma.TransactionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaction>
          }
          groupBy: {
            args: Prisma.TransactionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransactionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransactionCountArgs<ExtArgs>
            result: $Utils.Optional<TransactionCountAggregateOutputType> | number
          }
        }
      }
      Billing: {
        payload: Prisma.$BillingPayload<ExtArgs>
        fields: Prisma.BillingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BillingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BillingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>
          }
          findFirst: {
            args: Prisma.BillingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BillingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>
          }
          findMany: {
            args: Prisma.BillingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>[]
          }
          create: {
            args: Prisma.BillingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>
          }
          createMany: {
            args: Prisma.BillingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BillingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>[]
          }
          delete: {
            args: Prisma.BillingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>
          }
          update: {
            args: Prisma.BillingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>
          }
          deleteMany: {
            args: Prisma.BillingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BillingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.BillingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BillingPayload>
          }
          aggregate: {
            args: Prisma.BillingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBilling>
          }
          groupBy: {
            args: Prisma.BillingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BillingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BillingCountArgs<ExtArgs>
            result: $Utils.Optional<BillingCountAggregateOutputType> | number
          }
        }
      }
      Customer: {
        payload: Prisma.$CustomerPayload<ExtArgs>
        fields: Prisma.CustomerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findFirst: {
            args: Prisma.CustomerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          findMany: {
            args: Prisma.CustomerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          create: {
            args: Prisma.CustomerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          createMany: {
            args: Prisma.CustomerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CustomerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>[]
          }
          delete: {
            args: Prisma.CustomerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          update: {
            args: Prisma.CustomerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          deleteMany: {
            args: Prisma.CustomerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomerPayload>
          }
          aggregate: {
            args: Prisma.CustomerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomer>
          }
          groupBy: {
            args: Prisma.CustomerGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomerGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomerCountArgs<ExtArgs>
            result: $Utils.Optional<CustomerCountAggregateOutputType> | number
          }
        }
      }
      CompanySetting: {
        payload: Prisma.$CompanySettingPayload<ExtArgs>
        fields: Prisma.CompanySettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanySettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanySettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          findFirst: {
            args: Prisma.CompanySettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanySettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          findMany: {
            args: Prisma.CompanySettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>[]
          }
          create: {
            args: Prisma.CompanySettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          createMany: {
            args: Prisma.CompanySettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanySettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>[]
          }
          delete: {
            args: Prisma.CompanySettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          update: {
            args: Prisma.CompanySettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          deleteMany: {
            args: Prisma.CompanySettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanySettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CompanySettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanySettingPayload>
          }
          aggregate: {
            args: Prisma.CompanySettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompanySetting>
          }
          groupBy: {
            args: Prisma.CompanySettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanySettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanySettingCountArgs<ExtArgs>
            result: $Utils.Optional<CompanySettingCountAggregateOutputType> | number
          }
        }
      }
      Module: {
        payload: Prisma.$ModulePayload<ExtArgs>
        fields: Prisma.ModuleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ModuleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ModuleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          findFirst: {
            args: Prisma.ModuleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ModuleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          findMany: {
            args: Prisma.ModuleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          create: {
            args: Prisma.ModuleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          createMany: {
            args: Prisma.ModuleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ModuleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>[]
          }
          delete: {
            args: Prisma.ModuleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          update: {
            args: Prisma.ModuleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          deleteMany: {
            args: Prisma.ModuleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ModuleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ModuleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ModulePayload>
          }
          aggregate: {
            args: Prisma.ModuleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateModule>
          }
          groupBy: {
            args: Prisma.ModuleGroupByArgs<ExtArgs>
            result: $Utils.Optional<ModuleGroupByOutputType>[]
          }
          count: {
            args: Prisma.ModuleCountArgs<ExtArgs>
            result: $Utils.Optional<ModuleCountAggregateOutputType> | number
          }
        }
      }
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>
        fields: Prisma.PermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermission>
          }
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number
          }
        }
      }
      SystemLog: {
        payload: Prisma.$SystemLogPayload<ExtArgs>
        fields: Prisma.SystemLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          findFirst: {
            args: Prisma.SystemLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          findMany: {
            args: Prisma.SystemLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>[]
          }
          create: {
            args: Prisma.SystemLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          createMany: {
            args: Prisma.SystemLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>[]
          }
          delete: {
            args: Prisma.SystemLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          update: {
            args: Prisma.SystemLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          deleteMany: {
            args: Prisma.SystemLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SystemLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemLogPayload>
          }
          aggregate: {
            args: Prisma.SystemLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemLog>
          }
          groupBy: {
            args: Prisma.SystemLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemLogCountArgs<ExtArgs>
            result: $Utils.Optional<SystemLogCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    transactions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    users: number
    permissions: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | RoleCountOutputTypeCountUsersArgs
    permissions?: boolean | RoleCountOutputTypeCountPermissionsArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
  }


  /**
   * Count Type CategoryCountOutputType
   */

  export type CategoryCountOutputType = {
    subcategories: number
    skus: number
  }

  export type CategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subcategories?: boolean | CategoryCountOutputTypeCountSubcategoriesArgs
    skus?: boolean | CategoryCountOutputTypeCountSkusArgs
  }

  // Custom InputTypes
  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CategoryCountOutputType
     */
    select?: CategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountSubcategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubCategoryWhereInput
  }

  /**
   * CategoryCountOutputType without action
   */
  export type CategoryCountOutputTypeCountSkusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SKUWhereInput
  }


  /**
   * Count Type SubCategoryCountOutputType
   */

  export type SubCategoryCountOutputType = {
    skus: number
  }

  export type SubCategoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    skus?: boolean | SubCategoryCountOutputTypeCountSkusArgs
  }

  // Custom InputTypes
  /**
   * SubCategoryCountOutputType without action
   */
  export type SubCategoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategoryCountOutputType
     */
    select?: SubCategoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SubCategoryCountOutputType without action
   */
  export type SubCategoryCountOutputTypeCountSkusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SKUWhereInput
  }


  /**
   * Count Type SKUCountOutputType
   */

  export type SKUCountOutputType = {
    inventories: number
    transactions: number
    billings: number
  }

  export type SKUCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventories?: boolean | SKUCountOutputTypeCountInventoriesArgs
    transactions?: boolean | SKUCountOutputTypeCountTransactionsArgs
    billings?: boolean | SKUCountOutputTypeCountBillingsArgs
  }

  // Custom InputTypes
  /**
   * SKUCountOutputType without action
   */
  export type SKUCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKUCountOutputType
     */
    select?: SKUCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SKUCountOutputType without action
   */
  export type SKUCountOutputTypeCountInventoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
  }

  /**
   * SKUCountOutputType without action
   */
  export type SKUCountOutputTypeCountTransactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
  }

  /**
   * SKUCountOutputType without action
   */
  export type SKUCountOutputTypeCountBillingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingWhereInput
  }


  /**
   * Count Type RackCountOutputType
   */

  export type RackCountOutputType = {
    shelves: number
  }

  export type RackCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shelves?: boolean | RackCountOutputTypeCountShelvesArgs
  }

  // Custom InputTypes
  /**
   * RackCountOutputType without action
   */
  export type RackCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RackCountOutputType
     */
    select?: RackCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RackCountOutputType without action
   */
  export type RackCountOutputTypeCountShelvesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShelfWhereInput
  }


  /**
   * Count Type ShelfCountOutputType
   */

  export type ShelfCountOutputType = {
    inventories: number
  }

  export type ShelfCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    inventories?: boolean | ShelfCountOutputTypeCountInventoriesArgs
  }

  // Custom InputTypes
  /**
   * ShelfCountOutputType without action
   */
  export type ShelfCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ShelfCountOutputType
     */
    select?: ShelfCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ShelfCountOutputType without action
   */
  export type ShelfCountOutputTypeCountInventoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
  }


  /**
   * Count Type CustomerCountOutputType
   */

  export type CustomerCountOutputType = {
    billings: number
  }

  export type CustomerCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billings?: boolean | CustomerCountOutputTypeCountBillingsArgs
  }

  // Custom InputTypes
  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomerCountOutputType
     */
    select?: CustomerCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CustomerCountOutputType without action
   */
  export type CustomerCountOutputTypeCountBillingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingWhereInput
  }


  /**
   * Count Type ModuleCountOutputType
   */

  export type ModuleCountOutputType = {
    permissions: number
  }

  export type ModuleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | ModuleCountOutputTypeCountPermissionsArgs
  }

  // Custom InputTypes
  /**
   * ModuleCountOutputType without action
   */
  export type ModuleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ModuleCountOutputType
     */
    select?: ModuleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ModuleCountOutputType without action
   */
  export type ModuleCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    roleId: string | null
    createdAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    roleId: string | null
    createdAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    roleId: number
    createdAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    roleId?: true
    createdAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    roleId?: true
    createdAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    roleId?: true
    createdAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    roleId: string
    createdAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    roleId?: boolean
    createdAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    roleId?: boolean
    createdAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    roleId?: boolean
    createdAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    transactions?: boolean | User$transactionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      roleId: string
      createdAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    transactions<T extends User$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly roleId: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.transactions
   */
  export type User$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type RoleMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type RoleMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: string
    name: string
    _count: RoleCountAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    users?: boolean | Role$usersArgs<ExtArgs>
    permissions?: boolean | Role$permissionsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Role$usersArgs<ExtArgs>
    permissions?: boolean | Role$permissionsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      permissions: Prisma.$PermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Role$usersArgs<ExtArgs> = {}>(args?: Subset<T, Role$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    permissions<T extends Role$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, Role$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */ 
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'String'>
    readonly name: FieldRef<"Role", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
  }

  /**
   * Role.users
   */
  export type Role$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Role.permissions
   */
  export type Role$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    cursor?: PermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model Category
   */

  export type AggregateCategory = {
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  export type CategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type CategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type CategoryCountAggregateOutputType = {
    id: number
    name: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type CategoryMinAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    createdAt?: true
  }

  export type CategoryMaxAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    createdAt?: true
  }

  export type CategoryCountAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type CategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Category to aggregate.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Categories
    **/
    _count?: true | CategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CategoryMaxAggregateInputType
  }

  export type GetCategoryAggregateType<T extends CategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCategory[P]>
      : GetScalarType<T[P], AggregateCategory[P]>
  }




  export type CategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CategoryWhereInput
    orderBy?: CategoryOrderByWithAggregationInput | CategoryOrderByWithAggregationInput[]
    by: CategoryScalarFieldEnum[] | CategoryScalarFieldEnum
    having?: CategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CategoryCountAggregateInputType | true
    _min?: CategoryMinAggregateInputType
    _max?: CategoryMaxAggregateInputType
  }

  export type CategoryGroupByOutputType = {
    id: string
    name: string
    isActive: boolean
    createdAt: Date
    _count: CategoryCountAggregateOutputType | null
    _min: CategoryMinAggregateOutputType | null
    _max: CategoryMaxAggregateOutputType | null
  }

  type GetCategoryGroupByPayload<T extends CategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CategoryGroupByOutputType[P]>
            : GetScalarType<T[P], CategoryGroupByOutputType[P]>
        }
      >
    >


  export type CategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
    subcategories?: boolean | Category$subcategoriesArgs<ExtArgs>
    skus?: boolean | Category$skusArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["category"]>

  export type CategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["category"]>

  export type CategorySelectScalar = {
    id?: boolean
    name?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type CategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subcategories?: boolean | Category$subcategoriesArgs<ExtArgs>
    skus?: boolean | Category$skusArgs<ExtArgs>
    _count?: boolean | CategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Category"
    objects: {
      subcategories: Prisma.$SubCategoryPayload<ExtArgs>[]
      skus: Prisma.$SKUPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["category"]>
    composites: {}
  }

  type CategoryGetPayload<S extends boolean | null | undefined | CategoryDefaultArgs> = $Result.GetResult<Prisma.$CategoryPayload, S>

  type CategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CategoryCountAggregateInputType | true
    }

  export interface CategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Category'], meta: { name: 'Category' } }
    /**
     * Find zero or one Category that matches the filter.
     * @param {CategoryFindUniqueArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CategoryFindUniqueArgs>(args: SelectSubset<T, CategoryFindUniqueArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Category that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CategoryFindUniqueOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, CategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Category that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CategoryFindFirstArgs>(args?: SelectSubset<T, CategoryFindFirstArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Category that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindFirstOrThrowArgs} args - Arguments to find a Category
     * @example
     * // Get one Category
     * const category = await prisma.category.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, CategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Categories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Categories
     * const categories = await prisma.category.findMany()
     * 
     * // Get first 10 Categories
     * const categories = await prisma.category.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const categoryWithIdOnly = await prisma.category.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CategoryFindManyArgs>(args?: SelectSubset<T, CategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Category.
     * @param {CategoryCreateArgs} args - Arguments to create a Category.
     * @example
     * // Create one Category
     * const Category = await prisma.category.create({
     *   data: {
     *     // ... data to create a Category
     *   }
     * })
     * 
     */
    create<T extends CategoryCreateArgs>(args: SelectSubset<T, CategoryCreateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Categories.
     * @param {CategoryCreateManyArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CategoryCreateManyArgs>(args?: SelectSubset<T, CategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Categories and returns the data saved in the database.
     * @param {CategoryCreateManyAndReturnArgs} args - Arguments to create many Categories.
     * @example
     * // Create many Categories
     * const category = await prisma.category.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Categories and only return the `id`
     * const categoryWithIdOnly = await prisma.category.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, CategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Category.
     * @param {CategoryDeleteArgs} args - Arguments to delete one Category.
     * @example
     * // Delete one Category
     * const Category = await prisma.category.delete({
     *   where: {
     *     // ... filter to delete one Category
     *   }
     * })
     * 
     */
    delete<T extends CategoryDeleteArgs>(args: SelectSubset<T, CategoryDeleteArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Category.
     * @param {CategoryUpdateArgs} args - Arguments to update one Category.
     * @example
     * // Update one Category
     * const category = await prisma.category.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CategoryUpdateArgs>(args: SelectSubset<T, CategoryUpdateArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Categories.
     * @param {CategoryDeleteManyArgs} args - Arguments to filter Categories to delete.
     * @example
     * // Delete a few Categories
     * const { count } = await prisma.category.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CategoryDeleteManyArgs>(args?: SelectSubset<T, CategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Categories
     * const category = await prisma.category.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CategoryUpdateManyArgs>(args: SelectSubset<T, CategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Category.
     * @param {CategoryUpsertArgs} args - Arguments to update or create a Category.
     * @example
     * // Update or create a Category
     * const category = await prisma.category.upsert({
     *   create: {
     *     // ... data to create a Category
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Category we want to update
     *   }
     * })
     */
    upsert<T extends CategoryUpsertArgs>(args: SelectSubset<T, CategoryUpsertArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Categories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryCountArgs} args - Arguments to filter Categories to count.
     * @example
     * // Count the number of Categories
     * const count = await prisma.category.count({
     *   where: {
     *     // ... the filter for the Categories we want to count
     *   }
     * })
    **/
    count<T extends CategoryCountArgs>(
      args?: Subset<T, CategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CategoryAggregateArgs>(args: Subset<T, CategoryAggregateArgs>): Prisma.PrismaPromise<GetCategoryAggregateType<T>>

    /**
     * Group by Category.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CategoryGroupByArgs['orderBy'] }
        : { orderBy?: CategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Category model
   */
  readonly fields: CategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Category.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subcategories<T extends Category$subcategoriesArgs<ExtArgs> = {}>(args?: Subset<T, Category$subcategoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "findMany"> | Null>
    skus<T extends Category$skusArgs<ExtArgs> = {}>(args?: Subset<T, Category$skusArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Category model
   */ 
  interface CategoryFieldRefs {
    readonly id: FieldRef<"Category", 'String'>
    readonly name: FieldRef<"Category", 'String'>
    readonly isActive: FieldRef<"Category", 'Boolean'>
    readonly createdAt: FieldRef<"Category", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Category findUnique
   */
  export type CategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findUniqueOrThrow
   */
  export type CategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category findFirst
   */
  export type CategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findFirstOrThrow
   */
  export type CategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Category to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Categories.
     */
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category findMany
   */
  export type CategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter, which Categories to fetch.
     */
    where?: CategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Categories to fetch.
     */
    orderBy?: CategoryOrderByWithRelationInput | CategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Categories.
     */
    cursor?: CategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Categories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Categories.
     */
    skip?: number
    distinct?: CategoryScalarFieldEnum | CategoryScalarFieldEnum[]
  }

  /**
   * Category create
   */
  export type CategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Category.
     */
    data: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
  }

  /**
   * Category createMany
   */
  export type CategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category createManyAndReturn
   */
  export type CategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Categories.
     */
    data: CategoryCreateManyInput | CategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Category update
   */
  export type CategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Category.
     */
    data: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
    /**
     * Choose, which Category to update.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category updateMany
   */
  export type CategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Categories.
     */
    data: XOR<CategoryUpdateManyMutationInput, CategoryUncheckedUpdateManyInput>
    /**
     * Filter which Categories to update
     */
    where?: CategoryWhereInput
  }

  /**
   * Category upsert
   */
  export type CategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Category to update in case it exists.
     */
    where: CategoryWhereUniqueInput
    /**
     * In case the Category found by the `where` argument doesn't exist, create a new Category with this data.
     */
    create: XOR<CategoryCreateInput, CategoryUncheckedCreateInput>
    /**
     * In case the Category was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CategoryUpdateInput, CategoryUncheckedUpdateInput>
  }

  /**
   * Category delete
   */
  export type CategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
    /**
     * Filter which Category to delete.
     */
    where: CategoryWhereUniqueInput
  }

  /**
   * Category deleteMany
   */
  export type CategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Categories to delete
     */
    where?: CategoryWhereInput
  }

  /**
   * Category.subcategories
   */
  export type Category$subcategoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    where?: SubCategoryWhereInput
    orderBy?: SubCategoryOrderByWithRelationInput | SubCategoryOrderByWithRelationInput[]
    cursor?: SubCategoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SubCategoryScalarFieldEnum | SubCategoryScalarFieldEnum[]
  }

  /**
   * Category.skus
   */
  export type Category$skusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    where?: SKUWhereInput
    orderBy?: SKUOrderByWithRelationInput | SKUOrderByWithRelationInput[]
    cursor?: SKUWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SKUScalarFieldEnum | SKUScalarFieldEnum[]
  }

  /**
   * Category without action
   */
  export type CategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Category
     */
    select?: CategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CategoryInclude<ExtArgs> | null
  }


  /**
   * Model SubCategory
   */

  export type AggregateSubCategory = {
    _count: SubCategoryCountAggregateOutputType | null
    _min: SubCategoryMinAggregateOutputType | null
    _max: SubCategoryMaxAggregateOutputType | null
  }

  export type SubCategoryMinAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    categoryId: string | null
    createdAt: Date | null
  }

  export type SubCategoryMaxAggregateOutputType = {
    id: string | null
    name: string | null
    isActive: boolean | null
    categoryId: string | null
    createdAt: Date | null
  }

  export type SubCategoryCountAggregateOutputType = {
    id: number
    name: number
    isActive: number
    categoryId: number
    createdAt: number
    _all: number
  }


  export type SubCategoryMinAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    categoryId?: true
    createdAt?: true
  }

  export type SubCategoryMaxAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    categoryId?: true
    createdAt?: true
  }

  export type SubCategoryCountAggregateInputType = {
    id?: true
    name?: true
    isActive?: true
    categoryId?: true
    createdAt?: true
    _all?: true
  }

  export type SubCategoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubCategory to aggregate.
     */
    where?: SubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCategories to fetch.
     */
    orderBy?: SubCategoryOrderByWithRelationInput | SubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SubCategories
    **/
    _count?: true | SubCategoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SubCategoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SubCategoryMaxAggregateInputType
  }

  export type GetSubCategoryAggregateType<T extends SubCategoryAggregateArgs> = {
        [P in keyof T & keyof AggregateSubCategory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSubCategory[P]>
      : GetScalarType<T[P], AggregateSubCategory[P]>
  }




  export type SubCategoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SubCategoryWhereInput
    orderBy?: SubCategoryOrderByWithAggregationInput | SubCategoryOrderByWithAggregationInput[]
    by: SubCategoryScalarFieldEnum[] | SubCategoryScalarFieldEnum
    having?: SubCategoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SubCategoryCountAggregateInputType | true
    _min?: SubCategoryMinAggregateInputType
    _max?: SubCategoryMaxAggregateInputType
  }

  export type SubCategoryGroupByOutputType = {
    id: string
    name: string
    isActive: boolean
    categoryId: string
    createdAt: Date
    _count: SubCategoryCountAggregateOutputType | null
    _min: SubCategoryMinAggregateOutputType | null
    _max: SubCategoryMaxAggregateOutputType | null
  }

  type GetSubCategoryGroupByPayload<T extends SubCategoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SubCategoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SubCategoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SubCategoryGroupByOutputType[P]>
            : GetScalarType<T[P], SubCategoryGroupByOutputType[P]>
        }
      >
    >


  export type SubCategorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    categoryId?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    skus?: boolean | SubCategory$skusArgs<ExtArgs>
    _count?: boolean | SubCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subCategory"]>

  export type SubCategorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    isActive?: boolean
    categoryId?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["subCategory"]>

  export type SubCategorySelectScalar = {
    id?: boolean
    name?: boolean
    isActive?: boolean
    categoryId?: boolean
    createdAt?: boolean
  }

  export type SubCategoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    skus?: boolean | SubCategory$skusArgs<ExtArgs>
    _count?: boolean | SubCategoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SubCategoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
  }

  export type $SubCategoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SubCategory"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs>
      skus: Prisma.$SKUPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      isActive: boolean
      categoryId: string
      createdAt: Date
    }, ExtArgs["result"]["subCategory"]>
    composites: {}
  }

  type SubCategoryGetPayload<S extends boolean | null | undefined | SubCategoryDefaultArgs> = $Result.GetResult<Prisma.$SubCategoryPayload, S>

  type SubCategoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SubCategoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SubCategoryCountAggregateInputType | true
    }

  export interface SubCategoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SubCategory'], meta: { name: 'SubCategory' } }
    /**
     * Find zero or one SubCategory that matches the filter.
     * @param {SubCategoryFindUniqueArgs} args - Arguments to find a SubCategory
     * @example
     * // Get one SubCategory
     * const subCategory = await prisma.subCategory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SubCategoryFindUniqueArgs>(args: SelectSubset<T, SubCategoryFindUniqueArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SubCategory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SubCategoryFindUniqueOrThrowArgs} args - Arguments to find a SubCategory
     * @example
     * // Get one SubCategory
     * const subCategory = await prisma.subCategory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SubCategoryFindUniqueOrThrowArgs>(args: SelectSubset<T, SubCategoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SubCategory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCategoryFindFirstArgs} args - Arguments to find a SubCategory
     * @example
     * // Get one SubCategory
     * const subCategory = await prisma.subCategory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SubCategoryFindFirstArgs>(args?: SelectSubset<T, SubCategoryFindFirstArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SubCategory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCategoryFindFirstOrThrowArgs} args - Arguments to find a SubCategory
     * @example
     * // Get one SubCategory
     * const subCategory = await prisma.subCategory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SubCategoryFindFirstOrThrowArgs>(args?: SelectSubset<T, SubCategoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SubCategories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCategoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SubCategories
     * const subCategories = await prisma.subCategory.findMany()
     * 
     * // Get first 10 SubCategories
     * const subCategories = await prisma.subCategory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const subCategoryWithIdOnly = await prisma.subCategory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SubCategoryFindManyArgs>(args?: SelectSubset<T, SubCategoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SubCategory.
     * @param {SubCategoryCreateArgs} args - Arguments to create a SubCategory.
     * @example
     * // Create one SubCategory
     * const SubCategory = await prisma.subCategory.create({
     *   data: {
     *     // ... data to create a SubCategory
     *   }
     * })
     * 
     */
    create<T extends SubCategoryCreateArgs>(args: SelectSubset<T, SubCategoryCreateArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SubCategories.
     * @param {SubCategoryCreateManyArgs} args - Arguments to create many SubCategories.
     * @example
     * // Create many SubCategories
     * const subCategory = await prisma.subCategory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SubCategoryCreateManyArgs>(args?: SelectSubset<T, SubCategoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SubCategories and returns the data saved in the database.
     * @param {SubCategoryCreateManyAndReturnArgs} args - Arguments to create many SubCategories.
     * @example
     * // Create many SubCategories
     * const subCategory = await prisma.subCategory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SubCategories and only return the `id`
     * const subCategoryWithIdOnly = await prisma.subCategory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SubCategoryCreateManyAndReturnArgs>(args?: SelectSubset<T, SubCategoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SubCategory.
     * @param {SubCategoryDeleteArgs} args - Arguments to delete one SubCategory.
     * @example
     * // Delete one SubCategory
     * const SubCategory = await prisma.subCategory.delete({
     *   where: {
     *     // ... filter to delete one SubCategory
     *   }
     * })
     * 
     */
    delete<T extends SubCategoryDeleteArgs>(args: SelectSubset<T, SubCategoryDeleteArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SubCategory.
     * @param {SubCategoryUpdateArgs} args - Arguments to update one SubCategory.
     * @example
     * // Update one SubCategory
     * const subCategory = await prisma.subCategory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SubCategoryUpdateArgs>(args: SelectSubset<T, SubCategoryUpdateArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SubCategories.
     * @param {SubCategoryDeleteManyArgs} args - Arguments to filter SubCategories to delete.
     * @example
     * // Delete a few SubCategories
     * const { count } = await prisma.subCategory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SubCategoryDeleteManyArgs>(args?: SelectSubset<T, SubCategoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SubCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCategoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SubCategories
     * const subCategory = await prisma.subCategory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SubCategoryUpdateManyArgs>(args: SelectSubset<T, SubCategoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SubCategory.
     * @param {SubCategoryUpsertArgs} args - Arguments to update or create a SubCategory.
     * @example
     * // Update or create a SubCategory
     * const subCategory = await prisma.subCategory.upsert({
     *   create: {
     *     // ... data to create a SubCategory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SubCategory we want to update
     *   }
     * })
     */
    upsert<T extends SubCategoryUpsertArgs>(args: SelectSubset<T, SubCategoryUpsertArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SubCategories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCategoryCountArgs} args - Arguments to filter SubCategories to count.
     * @example
     * // Count the number of SubCategories
     * const count = await prisma.subCategory.count({
     *   where: {
     *     // ... the filter for the SubCategories we want to count
     *   }
     * })
    **/
    count<T extends SubCategoryCountArgs>(
      args?: Subset<T, SubCategoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SubCategoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SubCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCategoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SubCategoryAggregateArgs>(args: Subset<T, SubCategoryAggregateArgs>): Prisma.PrismaPromise<GetSubCategoryAggregateType<T>>

    /**
     * Group by SubCategory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SubCategoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SubCategoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SubCategoryGroupByArgs['orderBy'] }
        : { orderBy?: SubCategoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SubCategoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSubCategoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SubCategory model
   */
  readonly fields: SubCategoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SubCategory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SubCategoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    skus<T extends SubCategory$skusArgs<ExtArgs> = {}>(args?: Subset<T, SubCategory$skusArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SubCategory model
   */ 
  interface SubCategoryFieldRefs {
    readonly id: FieldRef<"SubCategory", 'String'>
    readonly name: FieldRef<"SubCategory", 'String'>
    readonly isActive: FieldRef<"SubCategory", 'Boolean'>
    readonly categoryId: FieldRef<"SubCategory", 'String'>
    readonly createdAt: FieldRef<"SubCategory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SubCategory findUnique
   */
  export type SubCategoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SubCategory to fetch.
     */
    where: SubCategoryWhereUniqueInput
  }

  /**
   * SubCategory findUniqueOrThrow
   */
  export type SubCategoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SubCategory to fetch.
     */
    where: SubCategoryWhereUniqueInput
  }

  /**
   * SubCategory findFirst
   */
  export type SubCategoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SubCategory to fetch.
     */
    where?: SubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCategories to fetch.
     */
    orderBy?: SubCategoryOrderByWithRelationInput | SubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubCategories.
     */
    cursor?: SubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubCategories.
     */
    distinct?: SubCategoryScalarFieldEnum | SubCategoryScalarFieldEnum[]
  }

  /**
   * SubCategory findFirstOrThrow
   */
  export type SubCategoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SubCategory to fetch.
     */
    where?: SubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCategories to fetch.
     */
    orderBy?: SubCategoryOrderByWithRelationInput | SubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SubCategories.
     */
    cursor?: SubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCategories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SubCategories.
     */
    distinct?: SubCategoryScalarFieldEnum | SubCategoryScalarFieldEnum[]
  }

  /**
   * SubCategory findMany
   */
  export type SubCategoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * Filter, which SubCategories to fetch.
     */
    where?: SubCategoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SubCategories to fetch.
     */
    orderBy?: SubCategoryOrderByWithRelationInput | SubCategoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SubCategories.
     */
    cursor?: SubCategoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SubCategories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SubCategories.
     */
    skip?: number
    distinct?: SubCategoryScalarFieldEnum | SubCategoryScalarFieldEnum[]
  }

  /**
   * SubCategory create
   */
  export type SubCategoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * The data needed to create a SubCategory.
     */
    data: XOR<SubCategoryCreateInput, SubCategoryUncheckedCreateInput>
  }

  /**
   * SubCategory createMany
   */
  export type SubCategoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SubCategories.
     */
    data: SubCategoryCreateManyInput | SubCategoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SubCategory createManyAndReturn
   */
  export type SubCategoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SubCategories.
     */
    data: SubCategoryCreateManyInput | SubCategoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SubCategory update
   */
  export type SubCategoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * The data needed to update a SubCategory.
     */
    data: XOR<SubCategoryUpdateInput, SubCategoryUncheckedUpdateInput>
    /**
     * Choose, which SubCategory to update.
     */
    where: SubCategoryWhereUniqueInput
  }

  /**
   * SubCategory updateMany
   */
  export type SubCategoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SubCategories.
     */
    data: XOR<SubCategoryUpdateManyMutationInput, SubCategoryUncheckedUpdateManyInput>
    /**
     * Filter which SubCategories to update
     */
    where?: SubCategoryWhereInput
  }

  /**
   * SubCategory upsert
   */
  export type SubCategoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * The filter to search for the SubCategory to update in case it exists.
     */
    where: SubCategoryWhereUniqueInput
    /**
     * In case the SubCategory found by the `where` argument doesn't exist, create a new SubCategory with this data.
     */
    create: XOR<SubCategoryCreateInput, SubCategoryUncheckedCreateInput>
    /**
     * In case the SubCategory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SubCategoryUpdateInput, SubCategoryUncheckedUpdateInput>
  }

  /**
   * SubCategory delete
   */
  export type SubCategoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
    /**
     * Filter which SubCategory to delete.
     */
    where: SubCategoryWhereUniqueInput
  }

  /**
   * SubCategory deleteMany
   */
  export type SubCategoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SubCategories to delete
     */
    where?: SubCategoryWhereInput
  }

  /**
   * SubCategory.skus
   */
  export type SubCategory$skusArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    where?: SKUWhereInput
    orderBy?: SKUOrderByWithRelationInput | SKUOrderByWithRelationInput[]
    cursor?: SKUWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SKUScalarFieldEnum | SKUScalarFieldEnum[]
  }

  /**
   * SubCategory without action
   */
  export type SubCategoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SubCategory
     */
    select?: SubCategorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SubCategoryInclude<ExtArgs> | null
  }


  /**
   * Model SKU
   */

  export type AggregateSKU = {
    _count: SKUCountAggregateOutputType | null
    _avg: SKUAvgAggregateOutputType | null
    _sum: SKUSumAggregateOutputType | null
    _min: SKUMinAggregateOutputType | null
    _max: SKUMaxAggregateOutputType | null
  }

  export type SKUAvgAggregateOutputType = {
    length: number | null
    width: number | null
    height: number | null
    weight: number | null
    stock: number | null
  }

  export type SKUSumAggregateOutputType = {
    length: number | null
    width: number | null
    height: number | null
    weight: number | null
    stock: number | null
  }

  export type SKUMinAggregateOutputType = {
    id: string | null
    skuCode: string | null
    productName: string | null
    categoryId: string | null
    subCategoryId: string | null
    length: number | null
    width: number | null
    height: number | null
    weight: number | null
    barcode: string | null
    barcodeFormat: string | null
    stock: number | null
    rackLocation: string | null
    createdAt: Date | null
  }

  export type SKUMaxAggregateOutputType = {
    id: string | null
    skuCode: string | null
    productName: string | null
    categoryId: string | null
    subCategoryId: string | null
    length: number | null
    width: number | null
    height: number | null
    weight: number | null
    barcode: string | null
    barcodeFormat: string | null
    stock: number | null
    rackLocation: string | null
    createdAt: Date | null
  }

  export type SKUCountAggregateOutputType = {
    id: number
    skuCode: number
    productName: number
    categoryId: number
    subCategoryId: number
    length: number
    width: number
    height: number
    weight: number
    barcode: number
    barcodeFormat: number
    stock: number
    rackLocation: number
    createdAt: number
    _all: number
  }


  export type SKUAvgAggregateInputType = {
    length?: true
    width?: true
    height?: true
    weight?: true
    stock?: true
  }

  export type SKUSumAggregateInputType = {
    length?: true
    width?: true
    height?: true
    weight?: true
    stock?: true
  }

  export type SKUMinAggregateInputType = {
    id?: true
    skuCode?: true
    productName?: true
    categoryId?: true
    subCategoryId?: true
    length?: true
    width?: true
    height?: true
    weight?: true
    barcode?: true
    barcodeFormat?: true
    stock?: true
    rackLocation?: true
    createdAt?: true
  }

  export type SKUMaxAggregateInputType = {
    id?: true
    skuCode?: true
    productName?: true
    categoryId?: true
    subCategoryId?: true
    length?: true
    width?: true
    height?: true
    weight?: true
    barcode?: true
    barcodeFormat?: true
    stock?: true
    rackLocation?: true
    createdAt?: true
  }

  export type SKUCountAggregateInputType = {
    id?: true
    skuCode?: true
    productName?: true
    categoryId?: true
    subCategoryId?: true
    length?: true
    width?: true
    height?: true
    weight?: true
    barcode?: true
    barcodeFormat?: true
    stock?: true
    rackLocation?: true
    createdAt?: true
    _all?: true
  }

  export type SKUAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SKU to aggregate.
     */
    where?: SKUWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SKUS to fetch.
     */
    orderBy?: SKUOrderByWithRelationInput | SKUOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SKUWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SKUS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SKUS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SKUS
    **/
    _count?: true | SKUCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SKUAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SKUSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SKUMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SKUMaxAggregateInputType
  }

  export type GetSKUAggregateType<T extends SKUAggregateArgs> = {
        [P in keyof T & keyof AggregateSKU]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSKU[P]>
      : GetScalarType<T[P], AggregateSKU[P]>
  }




  export type SKUGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SKUWhereInput
    orderBy?: SKUOrderByWithAggregationInput | SKUOrderByWithAggregationInput[]
    by: SKUScalarFieldEnum[] | SKUScalarFieldEnum
    having?: SKUScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SKUCountAggregateInputType | true
    _avg?: SKUAvgAggregateInputType
    _sum?: SKUSumAggregateInputType
    _min?: SKUMinAggregateInputType
    _max?: SKUMaxAggregateInputType
  }

  export type SKUGroupByOutputType = {
    id: string
    skuCode: string
    productName: string
    categoryId: string
    subCategoryId: string
    length: number
    width: number
    height: number
    weight: number
    barcode: string | null
    barcodeFormat: string
    stock: number
    rackLocation: string | null
    createdAt: Date
    _count: SKUCountAggregateOutputType | null
    _avg: SKUAvgAggregateOutputType | null
    _sum: SKUSumAggregateOutputType | null
    _min: SKUMinAggregateOutputType | null
    _max: SKUMaxAggregateOutputType | null
  }

  type GetSKUGroupByPayload<T extends SKUGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SKUGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SKUGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SKUGroupByOutputType[P]>
            : GetScalarType<T[P], SKUGroupByOutputType[P]>
        }
      >
    >


  export type SKUSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    skuCode?: boolean
    productName?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    length?: boolean
    width?: boolean
    height?: boolean
    weight?: boolean
    barcode?: boolean
    barcodeFormat?: boolean
    stock?: boolean
    rackLocation?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    subCategory?: boolean | SubCategoryDefaultArgs<ExtArgs>
    inventories?: boolean | SKU$inventoriesArgs<ExtArgs>
    transactions?: boolean | SKU$transactionsArgs<ExtArgs>
    billings?: boolean | SKU$billingsArgs<ExtArgs>
    _count?: boolean | SKUCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sKU"]>

  export type SKUSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    skuCode?: boolean
    productName?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    length?: boolean
    width?: boolean
    height?: boolean
    weight?: boolean
    barcode?: boolean
    barcodeFormat?: boolean
    stock?: boolean
    rackLocation?: boolean
    createdAt?: boolean
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    subCategory?: boolean | SubCategoryDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["sKU"]>

  export type SKUSelectScalar = {
    id?: boolean
    skuCode?: boolean
    productName?: boolean
    categoryId?: boolean
    subCategoryId?: boolean
    length?: boolean
    width?: boolean
    height?: boolean
    weight?: boolean
    barcode?: boolean
    barcodeFormat?: boolean
    stock?: boolean
    rackLocation?: boolean
    createdAt?: boolean
  }

  export type SKUInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    subCategory?: boolean | SubCategoryDefaultArgs<ExtArgs>
    inventories?: boolean | SKU$inventoriesArgs<ExtArgs>
    transactions?: boolean | SKU$transactionsArgs<ExtArgs>
    billings?: boolean | SKU$billingsArgs<ExtArgs>
    _count?: boolean | SKUCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SKUIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    category?: boolean | CategoryDefaultArgs<ExtArgs>
    subCategory?: boolean | SubCategoryDefaultArgs<ExtArgs>
  }

  export type $SKUPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SKU"
    objects: {
      category: Prisma.$CategoryPayload<ExtArgs>
      subCategory: Prisma.$SubCategoryPayload<ExtArgs>
      inventories: Prisma.$InventoryPayload<ExtArgs>[]
      transactions: Prisma.$TransactionPayload<ExtArgs>[]
      billings: Prisma.$BillingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      skuCode: string
      productName: string
      categoryId: string
      subCategoryId: string
      length: number
      width: number
      height: number
      weight: number
      barcode: string | null
      barcodeFormat: string
      stock: number
      rackLocation: string | null
      createdAt: Date
    }, ExtArgs["result"]["sKU"]>
    composites: {}
  }

  type SKUGetPayload<S extends boolean | null | undefined | SKUDefaultArgs> = $Result.GetResult<Prisma.$SKUPayload, S>

  type SKUCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SKUFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SKUCountAggregateInputType | true
    }

  export interface SKUDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SKU'], meta: { name: 'SKU' } }
    /**
     * Find zero or one SKU that matches the filter.
     * @param {SKUFindUniqueArgs} args - Arguments to find a SKU
     * @example
     * // Get one SKU
     * const sKU = await prisma.sKU.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SKUFindUniqueArgs>(args: SelectSubset<T, SKUFindUniqueArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SKU that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SKUFindUniqueOrThrowArgs} args - Arguments to find a SKU
     * @example
     * // Get one SKU
     * const sKU = await prisma.sKU.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SKUFindUniqueOrThrowArgs>(args: SelectSubset<T, SKUFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SKU that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SKUFindFirstArgs} args - Arguments to find a SKU
     * @example
     * // Get one SKU
     * const sKU = await prisma.sKU.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SKUFindFirstArgs>(args?: SelectSubset<T, SKUFindFirstArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SKU that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SKUFindFirstOrThrowArgs} args - Arguments to find a SKU
     * @example
     * // Get one SKU
     * const sKU = await prisma.sKU.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SKUFindFirstOrThrowArgs>(args?: SelectSubset<T, SKUFindFirstOrThrowArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SKUS that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SKUFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SKUS
     * const sKUS = await prisma.sKU.findMany()
     * 
     * // Get first 10 SKUS
     * const sKUS = await prisma.sKU.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sKUWithIdOnly = await prisma.sKU.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SKUFindManyArgs>(args?: SelectSubset<T, SKUFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SKU.
     * @param {SKUCreateArgs} args - Arguments to create a SKU.
     * @example
     * // Create one SKU
     * const SKU = await prisma.sKU.create({
     *   data: {
     *     // ... data to create a SKU
     *   }
     * })
     * 
     */
    create<T extends SKUCreateArgs>(args: SelectSubset<T, SKUCreateArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SKUS.
     * @param {SKUCreateManyArgs} args - Arguments to create many SKUS.
     * @example
     * // Create many SKUS
     * const sKU = await prisma.sKU.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SKUCreateManyArgs>(args?: SelectSubset<T, SKUCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SKUS and returns the data saved in the database.
     * @param {SKUCreateManyAndReturnArgs} args - Arguments to create many SKUS.
     * @example
     * // Create many SKUS
     * const sKU = await prisma.sKU.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SKUS and only return the `id`
     * const sKUWithIdOnly = await prisma.sKU.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SKUCreateManyAndReturnArgs>(args?: SelectSubset<T, SKUCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SKU.
     * @param {SKUDeleteArgs} args - Arguments to delete one SKU.
     * @example
     * // Delete one SKU
     * const SKU = await prisma.sKU.delete({
     *   where: {
     *     // ... filter to delete one SKU
     *   }
     * })
     * 
     */
    delete<T extends SKUDeleteArgs>(args: SelectSubset<T, SKUDeleteArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SKU.
     * @param {SKUUpdateArgs} args - Arguments to update one SKU.
     * @example
     * // Update one SKU
     * const sKU = await prisma.sKU.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SKUUpdateArgs>(args: SelectSubset<T, SKUUpdateArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SKUS.
     * @param {SKUDeleteManyArgs} args - Arguments to filter SKUS to delete.
     * @example
     * // Delete a few SKUS
     * const { count } = await prisma.sKU.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SKUDeleteManyArgs>(args?: SelectSubset<T, SKUDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SKUS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SKUUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SKUS
     * const sKU = await prisma.sKU.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SKUUpdateManyArgs>(args: SelectSubset<T, SKUUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SKU.
     * @param {SKUUpsertArgs} args - Arguments to update or create a SKU.
     * @example
     * // Update or create a SKU
     * const sKU = await prisma.sKU.upsert({
     *   create: {
     *     // ... data to create a SKU
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SKU we want to update
     *   }
     * })
     */
    upsert<T extends SKUUpsertArgs>(args: SelectSubset<T, SKUUpsertArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SKUS.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SKUCountArgs} args - Arguments to filter SKUS to count.
     * @example
     * // Count the number of SKUS
     * const count = await prisma.sKU.count({
     *   where: {
     *     // ... the filter for the SKUS we want to count
     *   }
     * })
    **/
    count<T extends SKUCountArgs>(
      args?: Subset<T, SKUCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SKUCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SKU.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SKUAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SKUAggregateArgs>(args: Subset<T, SKUAggregateArgs>): Prisma.PrismaPromise<GetSKUAggregateType<T>>

    /**
     * Group by SKU.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SKUGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SKUGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SKUGroupByArgs['orderBy'] }
        : { orderBy?: SKUGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SKUGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSKUGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SKU model
   */
  readonly fields: SKUFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SKU.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SKUClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    category<T extends CategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CategoryDefaultArgs<ExtArgs>>): Prisma__CategoryClient<$Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    subCategory<T extends SubCategoryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SubCategoryDefaultArgs<ExtArgs>>): Prisma__SubCategoryClient<$Result.GetResult<Prisma.$SubCategoryPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    inventories<T extends SKU$inventoriesArgs<ExtArgs> = {}>(args?: Subset<T, SKU$inventoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany"> | Null>
    transactions<T extends SKU$transactionsArgs<ExtArgs> = {}>(args?: Subset<T, SKU$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany"> | Null>
    billings<T extends SKU$billingsArgs<ExtArgs> = {}>(args?: Subset<T, SKU$billingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SKU model
   */ 
  interface SKUFieldRefs {
    readonly id: FieldRef<"SKU", 'String'>
    readonly skuCode: FieldRef<"SKU", 'String'>
    readonly productName: FieldRef<"SKU", 'String'>
    readonly categoryId: FieldRef<"SKU", 'String'>
    readonly subCategoryId: FieldRef<"SKU", 'String'>
    readonly length: FieldRef<"SKU", 'Float'>
    readonly width: FieldRef<"SKU", 'Float'>
    readonly height: FieldRef<"SKU", 'Float'>
    readonly weight: FieldRef<"SKU", 'Float'>
    readonly barcode: FieldRef<"SKU", 'String'>
    readonly barcodeFormat: FieldRef<"SKU", 'String'>
    readonly stock: FieldRef<"SKU", 'Int'>
    readonly rackLocation: FieldRef<"SKU", 'String'>
    readonly createdAt: FieldRef<"SKU", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SKU findUnique
   */
  export type SKUFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * Filter, which SKU to fetch.
     */
    where: SKUWhereUniqueInput
  }

  /**
   * SKU findUniqueOrThrow
   */
  export type SKUFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * Filter, which SKU to fetch.
     */
    where: SKUWhereUniqueInput
  }

  /**
   * SKU findFirst
   */
  export type SKUFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * Filter, which SKU to fetch.
     */
    where?: SKUWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SKUS to fetch.
     */
    orderBy?: SKUOrderByWithRelationInput | SKUOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SKUS.
     */
    cursor?: SKUWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SKUS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SKUS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SKUS.
     */
    distinct?: SKUScalarFieldEnum | SKUScalarFieldEnum[]
  }

  /**
   * SKU findFirstOrThrow
   */
  export type SKUFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * Filter, which SKU to fetch.
     */
    where?: SKUWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SKUS to fetch.
     */
    orderBy?: SKUOrderByWithRelationInput | SKUOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SKUS.
     */
    cursor?: SKUWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SKUS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SKUS.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SKUS.
     */
    distinct?: SKUScalarFieldEnum | SKUScalarFieldEnum[]
  }

  /**
   * SKU findMany
   */
  export type SKUFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * Filter, which SKUS to fetch.
     */
    where?: SKUWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SKUS to fetch.
     */
    orderBy?: SKUOrderByWithRelationInput | SKUOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SKUS.
     */
    cursor?: SKUWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SKUS from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SKUS.
     */
    skip?: number
    distinct?: SKUScalarFieldEnum | SKUScalarFieldEnum[]
  }

  /**
   * SKU create
   */
  export type SKUCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * The data needed to create a SKU.
     */
    data: XOR<SKUCreateInput, SKUUncheckedCreateInput>
  }

  /**
   * SKU createMany
   */
  export type SKUCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SKUS.
     */
    data: SKUCreateManyInput | SKUCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SKU createManyAndReturn
   */
  export type SKUCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SKUS.
     */
    data: SKUCreateManyInput | SKUCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SKU update
   */
  export type SKUUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * The data needed to update a SKU.
     */
    data: XOR<SKUUpdateInput, SKUUncheckedUpdateInput>
    /**
     * Choose, which SKU to update.
     */
    where: SKUWhereUniqueInput
  }

  /**
   * SKU updateMany
   */
  export type SKUUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SKUS.
     */
    data: XOR<SKUUpdateManyMutationInput, SKUUncheckedUpdateManyInput>
    /**
     * Filter which SKUS to update
     */
    where?: SKUWhereInput
  }

  /**
   * SKU upsert
   */
  export type SKUUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * The filter to search for the SKU to update in case it exists.
     */
    where: SKUWhereUniqueInput
    /**
     * In case the SKU found by the `where` argument doesn't exist, create a new SKU with this data.
     */
    create: XOR<SKUCreateInput, SKUUncheckedCreateInput>
    /**
     * In case the SKU was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SKUUpdateInput, SKUUncheckedUpdateInput>
  }

  /**
   * SKU delete
   */
  export type SKUDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
    /**
     * Filter which SKU to delete.
     */
    where: SKUWhereUniqueInput
  }

  /**
   * SKU deleteMany
   */
  export type SKUDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SKUS to delete
     */
    where?: SKUWhereInput
  }

  /**
   * SKU.inventories
   */
  export type SKU$inventoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    cursor?: InventoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * SKU.transactions
   */
  export type SKU$transactionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    cursor?: TransactionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * SKU.billings
   */
  export type SKU$billingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    where?: BillingWhereInput
    orderBy?: BillingOrderByWithRelationInput | BillingOrderByWithRelationInput[]
    cursor?: BillingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingScalarFieldEnum | BillingScalarFieldEnum[]
  }

  /**
   * SKU without action
   */
  export type SKUDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SKU
     */
    select?: SKUSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SKUInclude<ExtArgs> | null
  }


  /**
   * Model Rack
   */

  export type AggregateRack = {
    _count: RackCountAggregateOutputType | null
    _min: RackMinAggregateOutputType | null
    _max: RackMaxAggregateOutputType | null
  }

  export type RackMinAggregateOutputType = {
    id: string | null
    name: string | null
    room: $Enums.Room | null
  }

  export type RackMaxAggregateOutputType = {
    id: string | null
    name: string | null
    room: $Enums.Room | null
  }

  export type RackCountAggregateOutputType = {
    id: number
    name: number
    room: number
    _all: number
  }


  export type RackMinAggregateInputType = {
    id?: true
    name?: true
    room?: true
  }

  export type RackMaxAggregateInputType = {
    id?: true
    name?: true
    room?: true
  }

  export type RackCountAggregateInputType = {
    id?: true
    name?: true
    room?: true
    _all?: true
  }

  export type RackAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Rack to aggregate.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Racks
    **/
    _count?: true | RackCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RackMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RackMaxAggregateInputType
  }

  export type GetRackAggregateType<T extends RackAggregateArgs> = {
        [P in keyof T & keyof AggregateRack]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRack[P]>
      : GetScalarType<T[P], AggregateRack[P]>
  }




  export type RackGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RackWhereInput
    orderBy?: RackOrderByWithAggregationInput | RackOrderByWithAggregationInput[]
    by: RackScalarFieldEnum[] | RackScalarFieldEnum
    having?: RackScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RackCountAggregateInputType | true
    _min?: RackMinAggregateInputType
    _max?: RackMaxAggregateInputType
  }

  export type RackGroupByOutputType = {
    id: string
    name: string
    room: $Enums.Room
    _count: RackCountAggregateOutputType | null
    _min: RackMinAggregateOutputType | null
    _max: RackMaxAggregateOutputType | null
  }

  type GetRackGroupByPayload<T extends RackGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RackGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RackGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RackGroupByOutputType[P]>
            : GetScalarType<T[P], RackGroupByOutputType[P]>
        }
      >
    >


  export type RackSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    room?: boolean
    shelves?: boolean | Rack$shelvesArgs<ExtArgs>
    _count?: boolean | RackCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rack"]>

  export type RackSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    room?: boolean
  }, ExtArgs["result"]["rack"]>

  export type RackSelectScalar = {
    id?: boolean
    name?: boolean
    room?: boolean
  }

  export type RackInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    shelves?: boolean | Rack$shelvesArgs<ExtArgs>
    _count?: boolean | RackCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RackIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RackPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Rack"
    objects: {
      shelves: Prisma.$ShelfPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      room: $Enums.Room
    }, ExtArgs["result"]["rack"]>
    composites: {}
  }

  type RackGetPayload<S extends boolean | null | undefined | RackDefaultArgs> = $Result.GetResult<Prisma.$RackPayload, S>

  type RackCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<RackFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: RackCountAggregateInputType | true
    }

  export interface RackDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Rack'], meta: { name: 'Rack' } }
    /**
     * Find zero or one Rack that matches the filter.
     * @param {RackFindUniqueArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RackFindUniqueArgs>(args: SelectSubset<T, RackFindUniqueArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Rack that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {RackFindUniqueOrThrowArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RackFindUniqueOrThrowArgs>(args: SelectSubset<T, RackFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Rack that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackFindFirstArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RackFindFirstArgs>(args?: SelectSubset<T, RackFindFirstArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Rack that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackFindFirstOrThrowArgs} args - Arguments to find a Rack
     * @example
     * // Get one Rack
     * const rack = await prisma.rack.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RackFindFirstOrThrowArgs>(args?: SelectSubset<T, RackFindFirstOrThrowArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Racks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Racks
     * const racks = await prisma.rack.findMany()
     * 
     * // Get first 10 Racks
     * const racks = await prisma.rack.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rackWithIdOnly = await prisma.rack.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RackFindManyArgs>(args?: SelectSubset<T, RackFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Rack.
     * @param {RackCreateArgs} args - Arguments to create a Rack.
     * @example
     * // Create one Rack
     * const Rack = await prisma.rack.create({
     *   data: {
     *     // ... data to create a Rack
     *   }
     * })
     * 
     */
    create<T extends RackCreateArgs>(args: SelectSubset<T, RackCreateArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Racks.
     * @param {RackCreateManyArgs} args - Arguments to create many Racks.
     * @example
     * // Create many Racks
     * const rack = await prisma.rack.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RackCreateManyArgs>(args?: SelectSubset<T, RackCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Racks and returns the data saved in the database.
     * @param {RackCreateManyAndReturnArgs} args - Arguments to create many Racks.
     * @example
     * // Create many Racks
     * const rack = await prisma.rack.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Racks and only return the `id`
     * const rackWithIdOnly = await prisma.rack.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RackCreateManyAndReturnArgs>(args?: SelectSubset<T, RackCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Rack.
     * @param {RackDeleteArgs} args - Arguments to delete one Rack.
     * @example
     * // Delete one Rack
     * const Rack = await prisma.rack.delete({
     *   where: {
     *     // ... filter to delete one Rack
     *   }
     * })
     * 
     */
    delete<T extends RackDeleteArgs>(args: SelectSubset<T, RackDeleteArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Rack.
     * @param {RackUpdateArgs} args - Arguments to update one Rack.
     * @example
     * // Update one Rack
     * const rack = await prisma.rack.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RackUpdateArgs>(args: SelectSubset<T, RackUpdateArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Racks.
     * @param {RackDeleteManyArgs} args - Arguments to filter Racks to delete.
     * @example
     * // Delete a few Racks
     * const { count } = await prisma.rack.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RackDeleteManyArgs>(args?: SelectSubset<T, RackDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Racks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Racks
     * const rack = await prisma.rack.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RackUpdateManyArgs>(args: SelectSubset<T, RackUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Rack.
     * @param {RackUpsertArgs} args - Arguments to update or create a Rack.
     * @example
     * // Update or create a Rack
     * const rack = await prisma.rack.upsert({
     *   create: {
     *     // ... data to create a Rack
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rack we want to update
     *   }
     * })
     */
    upsert<T extends RackUpsertArgs>(args: SelectSubset<T, RackUpsertArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Racks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackCountArgs} args - Arguments to filter Racks to count.
     * @example
     * // Count the number of Racks
     * const count = await prisma.rack.count({
     *   where: {
     *     // ... the filter for the Racks we want to count
     *   }
     * })
    **/
    count<T extends RackCountArgs>(
      args?: Subset<T, RackCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RackCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Rack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RackAggregateArgs>(args: Subset<T, RackAggregateArgs>): Prisma.PrismaPromise<GetRackAggregateType<T>>

    /**
     * Group by Rack.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RackGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RackGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RackGroupByArgs['orderBy'] }
        : { orderBy?: RackGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RackGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRackGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Rack model
   */
  readonly fields: RackFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Rack.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RackClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    shelves<T extends Rack$shelvesArgs<ExtArgs> = {}>(args?: Subset<T, Rack$shelvesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Rack model
   */ 
  interface RackFieldRefs {
    readonly id: FieldRef<"Rack", 'String'>
    readonly name: FieldRef<"Rack", 'String'>
    readonly room: FieldRef<"Rack", 'Room'>
  }
    

  // Custom InputTypes
  /**
   * Rack findUnique
   */
  export type RackFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack findUniqueOrThrow
   */
  export type RackFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack findFirst
   */
  export type RackFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Racks.
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Racks.
     */
    distinct?: RackScalarFieldEnum | RackScalarFieldEnum[]
  }

  /**
   * Rack findFirstOrThrow
   */
  export type RackFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Rack to fetch.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Racks.
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Racks.
     */
    distinct?: RackScalarFieldEnum | RackScalarFieldEnum[]
  }

  /**
   * Rack findMany
   */
  export type RackFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter, which Racks to fetch.
     */
    where?: RackWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Racks to fetch.
     */
    orderBy?: RackOrderByWithRelationInput | RackOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Racks.
     */
    cursor?: RackWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Racks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Racks.
     */
    skip?: number
    distinct?: RackScalarFieldEnum | RackScalarFieldEnum[]
  }

  /**
   * Rack create
   */
  export type RackCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * The data needed to create a Rack.
     */
    data: XOR<RackCreateInput, RackUncheckedCreateInput>
  }

  /**
   * Rack createMany
   */
  export type RackCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Racks.
     */
    data: RackCreateManyInput | RackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rack createManyAndReturn
   */
  export type RackCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Racks.
     */
    data: RackCreateManyInput | RackCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Rack update
   */
  export type RackUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * The data needed to update a Rack.
     */
    data: XOR<RackUpdateInput, RackUncheckedUpdateInput>
    /**
     * Choose, which Rack to update.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack updateMany
   */
  export type RackUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Racks.
     */
    data: XOR<RackUpdateManyMutationInput, RackUncheckedUpdateManyInput>
    /**
     * Filter which Racks to update
     */
    where?: RackWhereInput
  }

  /**
   * Rack upsert
   */
  export type RackUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * The filter to search for the Rack to update in case it exists.
     */
    where: RackWhereUniqueInput
    /**
     * In case the Rack found by the `where` argument doesn't exist, create a new Rack with this data.
     */
    create: XOR<RackCreateInput, RackUncheckedCreateInput>
    /**
     * In case the Rack was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RackUpdateInput, RackUncheckedUpdateInput>
  }

  /**
   * Rack delete
   */
  export type RackDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
    /**
     * Filter which Rack to delete.
     */
    where: RackWhereUniqueInput
  }

  /**
   * Rack deleteMany
   */
  export type RackDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Racks to delete
     */
    where?: RackWhereInput
  }

  /**
   * Rack.shelves
   */
  export type Rack$shelvesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    where?: ShelfWhereInput
    orderBy?: ShelfOrderByWithRelationInput | ShelfOrderByWithRelationInput[]
    cursor?: ShelfWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ShelfScalarFieldEnum | ShelfScalarFieldEnum[]
  }

  /**
   * Rack without action
   */
  export type RackDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rack
     */
    select?: RackSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RackInclude<ExtArgs> | null
  }


  /**
   * Model Shelf
   */

  export type AggregateShelf = {
    _count: ShelfCountAggregateOutputType | null
    _avg: ShelfAvgAggregateOutputType | null
    _sum: ShelfSumAggregateOutputType | null
    _min: ShelfMinAggregateOutputType | null
    _max: ShelfMaxAggregateOutputType | null
  }

  export type ShelfAvgAggregateOutputType = {
    maxVolume: number | null
    maxWeight: number | null
    usedVolume: number | null
    usedWeight: number | null
  }

  export type ShelfSumAggregateOutputType = {
    maxVolume: number | null
    maxWeight: number | null
    usedVolume: number | null
    usedWeight: number | null
  }

  export type ShelfMinAggregateOutputType = {
    id: string | null
    rackId: string | null
    level: $Enums.Level | null
    maxVolume: number | null
    maxWeight: number | null
    usedVolume: number | null
    usedWeight: number | null
  }

  export type ShelfMaxAggregateOutputType = {
    id: string | null
    rackId: string | null
    level: $Enums.Level | null
    maxVolume: number | null
    maxWeight: number | null
    usedVolume: number | null
    usedWeight: number | null
  }

  export type ShelfCountAggregateOutputType = {
    id: number
    rackId: number
    level: number
    maxVolume: number
    maxWeight: number
    usedVolume: number
    usedWeight: number
    _all: number
  }


  export type ShelfAvgAggregateInputType = {
    maxVolume?: true
    maxWeight?: true
    usedVolume?: true
    usedWeight?: true
  }

  export type ShelfSumAggregateInputType = {
    maxVolume?: true
    maxWeight?: true
    usedVolume?: true
    usedWeight?: true
  }

  export type ShelfMinAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    maxVolume?: true
    maxWeight?: true
    usedVolume?: true
    usedWeight?: true
  }

  export type ShelfMaxAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    maxVolume?: true
    maxWeight?: true
    usedVolume?: true
    usedWeight?: true
  }

  export type ShelfCountAggregateInputType = {
    id?: true
    rackId?: true
    level?: true
    maxVolume?: true
    maxWeight?: true
    usedVolume?: true
    usedWeight?: true
    _all?: true
  }

  export type ShelfAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shelf to aggregate.
     */
    where?: ShelfWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shelves to fetch.
     */
    orderBy?: ShelfOrderByWithRelationInput | ShelfOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ShelfWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shelves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shelves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Shelves
    **/
    _count?: true | ShelfCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ShelfAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ShelfSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ShelfMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ShelfMaxAggregateInputType
  }

  export type GetShelfAggregateType<T extends ShelfAggregateArgs> = {
        [P in keyof T & keyof AggregateShelf]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateShelf[P]>
      : GetScalarType<T[P], AggregateShelf[P]>
  }




  export type ShelfGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ShelfWhereInput
    orderBy?: ShelfOrderByWithAggregationInput | ShelfOrderByWithAggregationInput[]
    by: ShelfScalarFieldEnum[] | ShelfScalarFieldEnum
    having?: ShelfScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ShelfCountAggregateInputType | true
    _avg?: ShelfAvgAggregateInputType
    _sum?: ShelfSumAggregateInputType
    _min?: ShelfMinAggregateInputType
    _max?: ShelfMaxAggregateInputType
  }

  export type ShelfGroupByOutputType = {
    id: string
    rackId: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume: number
    usedWeight: number
    _count: ShelfCountAggregateOutputType | null
    _avg: ShelfAvgAggregateOutputType | null
    _sum: ShelfSumAggregateOutputType | null
    _min: ShelfMinAggregateOutputType | null
    _max: ShelfMaxAggregateOutputType | null
  }

  type GetShelfGroupByPayload<T extends ShelfGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ShelfGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ShelfGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ShelfGroupByOutputType[P]>
            : GetScalarType<T[P], ShelfGroupByOutputType[P]>
        }
      >
    >


  export type ShelfSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rackId?: boolean
    level?: boolean
    maxVolume?: boolean
    maxWeight?: boolean
    usedVolume?: boolean
    usedWeight?: boolean
    rack?: boolean | RackDefaultArgs<ExtArgs>
    inventories?: boolean | Shelf$inventoriesArgs<ExtArgs>
    _count?: boolean | ShelfCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shelf"]>

  export type ShelfSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    rackId?: boolean
    level?: boolean
    maxVolume?: boolean
    maxWeight?: boolean
    usedVolume?: boolean
    usedWeight?: boolean
    rack?: boolean | RackDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["shelf"]>

  export type ShelfSelectScalar = {
    id?: boolean
    rackId?: boolean
    level?: boolean
    maxVolume?: boolean
    maxWeight?: boolean
    usedVolume?: boolean
    usedWeight?: boolean
  }

  export type ShelfInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rack?: boolean | RackDefaultArgs<ExtArgs>
    inventories?: boolean | Shelf$inventoriesArgs<ExtArgs>
    _count?: boolean | ShelfCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ShelfIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rack?: boolean | RackDefaultArgs<ExtArgs>
  }

  export type $ShelfPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Shelf"
    objects: {
      rack: Prisma.$RackPayload<ExtArgs>
      inventories: Prisma.$InventoryPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      rackId: string
      level: $Enums.Level
      maxVolume: number
      maxWeight: number
      usedVolume: number
      usedWeight: number
    }, ExtArgs["result"]["shelf"]>
    composites: {}
  }

  type ShelfGetPayload<S extends boolean | null | undefined | ShelfDefaultArgs> = $Result.GetResult<Prisma.$ShelfPayload, S>

  type ShelfCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ShelfFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ShelfCountAggregateInputType | true
    }

  export interface ShelfDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Shelf'], meta: { name: 'Shelf' } }
    /**
     * Find zero or one Shelf that matches the filter.
     * @param {ShelfFindUniqueArgs} args - Arguments to find a Shelf
     * @example
     * // Get one Shelf
     * const shelf = await prisma.shelf.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ShelfFindUniqueArgs>(args: SelectSubset<T, ShelfFindUniqueArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Shelf that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ShelfFindUniqueOrThrowArgs} args - Arguments to find a Shelf
     * @example
     * // Get one Shelf
     * const shelf = await prisma.shelf.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ShelfFindUniqueOrThrowArgs>(args: SelectSubset<T, ShelfFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Shelf that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShelfFindFirstArgs} args - Arguments to find a Shelf
     * @example
     * // Get one Shelf
     * const shelf = await prisma.shelf.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ShelfFindFirstArgs>(args?: SelectSubset<T, ShelfFindFirstArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Shelf that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShelfFindFirstOrThrowArgs} args - Arguments to find a Shelf
     * @example
     * // Get one Shelf
     * const shelf = await prisma.shelf.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ShelfFindFirstOrThrowArgs>(args?: SelectSubset<T, ShelfFindFirstOrThrowArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Shelves that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShelfFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Shelves
     * const shelves = await prisma.shelf.findMany()
     * 
     * // Get first 10 Shelves
     * const shelves = await prisma.shelf.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const shelfWithIdOnly = await prisma.shelf.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ShelfFindManyArgs>(args?: SelectSubset<T, ShelfFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Shelf.
     * @param {ShelfCreateArgs} args - Arguments to create a Shelf.
     * @example
     * // Create one Shelf
     * const Shelf = await prisma.shelf.create({
     *   data: {
     *     // ... data to create a Shelf
     *   }
     * })
     * 
     */
    create<T extends ShelfCreateArgs>(args: SelectSubset<T, ShelfCreateArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Shelves.
     * @param {ShelfCreateManyArgs} args - Arguments to create many Shelves.
     * @example
     * // Create many Shelves
     * const shelf = await prisma.shelf.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ShelfCreateManyArgs>(args?: SelectSubset<T, ShelfCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Shelves and returns the data saved in the database.
     * @param {ShelfCreateManyAndReturnArgs} args - Arguments to create many Shelves.
     * @example
     * // Create many Shelves
     * const shelf = await prisma.shelf.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Shelves and only return the `id`
     * const shelfWithIdOnly = await prisma.shelf.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ShelfCreateManyAndReturnArgs>(args?: SelectSubset<T, ShelfCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Shelf.
     * @param {ShelfDeleteArgs} args - Arguments to delete one Shelf.
     * @example
     * // Delete one Shelf
     * const Shelf = await prisma.shelf.delete({
     *   where: {
     *     // ... filter to delete one Shelf
     *   }
     * })
     * 
     */
    delete<T extends ShelfDeleteArgs>(args: SelectSubset<T, ShelfDeleteArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Shelf.
     * @param {ShelfUpdateArgs} args - Arguments to update one Shelf.
     * @example
     * // Update one Shelf
     * const shelf = await prisma.shelf.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ShelfUpdateArgs>(args: SelectSubset<T, ShelfUpdateArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Shelves.
     * @param {ShelfDeleteManyArgs} args - Arguments to filter Shelves to delete.
     * @example
     * // Delete a few Shelves
     * const { count } = await prisma.shelf.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ShelfDeleteManyArgs>(args?: SelectSubset<T, ShelfDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Shelves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShelfUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Shelves
     * const shelf = await prisma.shelf.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ShelfUpdateManyArgs>(args: SelectSubset<T, ShelfUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Shelf.
     * @param {ShelfUpsertArgs} args - Arguments to update or create a Shelf.
     * @example
     * // Update or create a Shelf
     * const shelf = await prisma.shelf.upsert({
     *   create: {
     *     // ... data to create a Shelf
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Shelf we want to update
     *   }
     * })
     */
    upsert<T extends ShelfUpsertArgs>(args: SelectSubset<T, ShelfUpsertArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Shelves.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShelfCountArgs} args - Arguments to filter Shelves to count.
     * @example
     * // Count the number of Shelves
     * const count = await prisma.shelf.count({
     *   where: {
     *     // ... the filter for the Shelves we want to count
     *   }
     * })
    **/
    count<T extends ShelfCountArgs>(
      args?: Subset<T, ShelfCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ShelfCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Shelf.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShelfAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ShelfAggregateArgs>(args: Subset<T, ShelfAggregateArgs>): Prisma.PrismaPromise<GetShelfAggregateType<T>>

    /**
     * Group by Shelf.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ShelfGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ShelfGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ShelfGroupByArgs['orderBy'] }
        : { orderBy?: ShelfGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ShelfGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetShelfGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Shelf model
   */
  readonly fields: ShelfFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Shelf.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ShelfClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    rack<T extends RackDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RackDefaultArgs<ExtArgs>>): Prisma__RackClient<$Result.GetResult<Prisma.$RackPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    inventories<T extends Shelf$inventoriesArgs<ExtArgs> = {}>(args?: Subset<T, Shelf$inventoriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Shelf model
   */ 
  interface ShelfFieldRefs {
    readonly id: FieldRef<"Shelf", 'String'>
    readonly rackId: FieldRef<"Shelf", 'String'>
    readonly level: FieldRef<"Shelf", 'Level'>
    readonly maxVolume: FieldRef<"Shelf", 'Float'>
    readonly maxWeight: FieldRef<"Shelf", 'Float'>
    readonly usedVolume: FieldRef<"Shelf", 'Float'>
    readonly usedWeight: FieldRef<"Shelf", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * Shelf findUnique
   */
  export type ShelfFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * Filter, which Shelf to fetch.
     */
    where: ShelfWhereUniqueInput
  }

  /**
   * Shelf findUniqueOrThrow
   */
  export type ShelfFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * Filter, which Shelf to fetch.
     */
    where: ShelfWhereUniqueInput
  }

  /**
   * Shelf findFirst
   */
  export type ShelfFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * Filter, which Shelf to fetch.
     */
    where?: ShelfWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shelves to fetch.
     */
    orderBy?: ShelfOrderByWithRelationInput | ShelfOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shelves.
     */
    cursor?: ShelfWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shelves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shelves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shelves.
     */
    distinct?: ShelfScalarFieldEnum | ShelfScalarFieldEnum[]
  }

  /**
   * Shelf findFirstOrThrow
   */
  export type ShelfFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * Filter, which Shelf to fetch.
     */
    where?: ShelfWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shelves to fetch.
     */
    orderBy?: ShelfOrderByWithRelationInput | ShelfOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Shelves.
     */
    cursor?: ShelfWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shelves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shelves.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Shelves.
     */
    distinct?: ShelfScalarFieldEnum | ShelfScalarFieldEnum[]
  }

  /**
   * Shelf findMany
   */
  export type ShelfFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * Filter, which Shelves to fetch.
     */
    where?: ShelfWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Shelves to fetch.
     */
    orderBy?: ShelfOrderByWithRelationInput | ShelfOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Shelves.
     */
    cursor?: ShelfWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Shelves from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Shelves.
     */
    skip?: number
    distinct?: ShelfScalarFieldEnum | ShelfScalarFieldEnum[]
  }

  /**
   * Shelf create
   */
  export type ShelfCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * The data needed to create a Shelf.
     */
    data: XOR<ShelfCreateInput, ShelfUncheckedCreateInput>
  }

  /**
   * Shelf createMany
   */
  export type ShelfCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Shelves.
     */
    data: ShelfCreateManyInput | ShelfCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Shelf createManyAndReturn
   */
  export type ShelfCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Shelves.
     */
    data: ShelfCreateManyInput | ShelfCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Shelf update
   */
  export type ShelfUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * The data needed to update a Shelf.
     */
    data: XOR<ShelfUpdateInput, ShelfUncheckedUpdateInput>
    /**
     * Choose, which Shelf to update.
     */
    where: ShelfWhereUniqueInput
  }

  /**
   * Shelf updateMany
   */
  export type ShelfUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Shelves.
     */
    data: XOR<ShelfUpdateManyMutationInput, ShelfUncheckedUpdateManyInput>
    /**
     * Filter which Shelves to update
     */
    where?: ShelfWhereInput
  }

  /**
   * Shelf upsert
   */
  export type ShelfUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * The filter to search for the Shelf to update in case it exists.
     */
    where: ShelfWhereUniqueInput
    /**
     * In case the Shelf found by the `where` argument doesn't exist, create a new Shelf with this data.
     */
    create: XOR<ShelfCreateInput, ShelfUncheckedCreateInput>
    /**
     * In case the Shelf was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ShelfUpdateInput, ShelfUncheckedUpdateInput>
  }

  /**
   * Shelf delete
   */
  export type ShelfDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
    /**
     * Filter which Shelf to delete.
     */
    where: ShelfWhereUniqueInput
  }

  /**
   * Shelf deleteMany
   */
  export type ShelfDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Shelves to delete
     */
    where?: ShelfWhereInput
  }

  /**
   * Shelf.inventories
   */
  export type Shelf$inventoriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    cursor?: InventoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Shelf without action
   */
  export type ShelfDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Shelf
     */
    select?: ShelfSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ShelfInclude<ExtArgs> | null
  }


  /**
   * Model Inventory
   */

  export type AggregateInventory = {
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  export type InventoryAvgAggregateOutputType = {
    quantity: number | null
  }

  export type InventorySumAggregateOutputType = {
    quantity: number | null
  }

  export type InventoryMinAggregateOutputType = {
    id: string | null
    skuId: string | null
    shelfId: string | null
    quantity: number | null
    qrCode: string | null
  }

  export type InventoryMaxAggregateOutputType = {
    id: string | null
    skuId: string | null
    shelfId: string | null
    quantity: number | null
    qrCode: string | null
  }

  export type InventoryCountAggregateOutputType = {
    id: number
    skuId: number
    shelfId: number
    quantity: number
    qrCode: number
    _all: number
  }


  export type InventoryAvgAggregateInputType = {
    quantity?: true
  }

  export type InventorySumAggregateInputType = {
    quantity?: true
  }

  export type InventoryMinAggregateInputType = {
    id?: true
    skuId?: true
    shelfId?: true
    quantity?: true
    qrCode?: true
  }

  export type InventoryMaxAggregateInputType = {
    id?: true
    skuId?: true
    shelfId?: true
    quantity?: true
    qrCode?: true
  }

  export type InventoryCountAggregateInputType = {
    id?: true
    skuId?: true
    shelfId?: true
    quantity?: true
    qrCode?: true
    _all?: true
  }

  export type InventoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventory to aggregate.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Inventories
    **/
    _count?: true | InventoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: InventoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: InventorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InventoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InventoryMaxAggregateInputType
  }

  export type GetInventoryAggregateType<T extends InventoryAggregateArgs> = {
        [P in keyof T & keyof AggregateInventory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInventory[P]>
      : GetScalarType<T[P], AggregateInventory[P]>
  }




  export type InventoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InventoryWhereInput
    orderBy?: InventoryOrderByWithAggregationInput | InventoryOrderByWithAggregationInput[]
    by: InventoryScalarFieldEnum[] | InventoryScalarFieldEnum
    having?: InventoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InventoryCountAggregateInputType | true
    _avg?: InventoryAvgAggregateInputType
    _sum?: InventorySumAggregateInputType
    _min?: InventoryMinAggregateInputType
    _max?: InventoryMaxAggregateInputType
  }

  export type InventoryGroupByOutputType = {
    id: string
    skuId: string
    shelfId: string
    quantity: number
    qrCode: string | null
    _count: InventoryCountAggregateOutputType | null
    _avg: InventoryAvgAggregateOutputType | null
    _sum: InventorySumAggregateOutputType | null
    _min: InventoryMinAggregateOutputType | null
    _max: InventoryMaxAggregateOutputType | null
  }

  type GetInventoryGroupByPayload<T extends InventoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InventoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InventoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InventoryGroupByOutputType[P]>
            : GetScalarType<T[P], InventoryGroupByOutputType[P]>
        }
      >
    >


  export type InventorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    skuId?: boolean
    shelfId?: boolean
    quantity?: boolean
    qrCode?: boolean
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    shelf?: boolean | ShelfDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    skuId?: boolean
    shelfId?: boolean
    quantity?: boolean
    qrCode?: boolean
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    shelf?: boolean | ShelfDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["inventory"]>

  export type InventorySelectScalar = {
    id?: boolean
    skuId?: boolean
    shelfId?: boolean
    quantity?: boolean
    qrCode?: boolean
  }

  export type InventoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    shelf?: boolean | ShelfDefaultArgs<ExtArgs>
  }
  export type InventoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    shelf?: boolean | ShelfDefaultArgs<ExtArgs>
  }

  export type $InventoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Inventory"
    objects: {
      sku: Prisma.$SKUPayload<ExtArgs>
      shelf: Prisma.$ShelfPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      skuId: string
      shelfId: string
      quantity: number
      qrCode: string | null
    }, ExtArgs["result"]["inventory"]>
    composites: {}
  }

  type InventoryGetPayload<S extends boolean | null | undefined | InventoryDefaultArgs> = $Result.GetResult<Prisma.$InventoryPayload, S>

  type InventoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<InventoryFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: InventoryCountAggregateInputType | true
    }

  export interface InventoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Inventory'], meta: { name: 'Inventory' } }
    /**
     * Find zero or one Inventory that matches the filter.
     * @param {InventoryFindUniqueArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InventoryFindUniqueArgs>(args: SelectSubset<T, InventoryFindUniqueArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Inventory that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {InventoryFindUniqueOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InventoryFindUniqueOrThrowArgs>(args: SelectSubset<T, InventoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Inventory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InventoryFindFirstArgs>(args?: SelectSubset<T, InventoryFindFirstArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Inventory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindFirstOrThrowArgs} args - Arguments to find a Inventory
     * @example
     * // Get one Inventory
     * const inventory = await prisma.inventory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InventoryFindFirstOrThrowArgs>(args?: SelectSubset<T, InventoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Inventories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Inventories
     * const inventories = await prisma.inventory.findMany()
     * 
     * // Get first 10 Inventories
     * const inventories = await prisma.inventory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const inventoryWithIdOnly = await prisma.inventory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InventoryFindManyArgs>(args?: SelectSubset<T, InventoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Inventory.
     * @param {InventoryCreateArgs} args - Arguments to create a Inventory.
     * @example
     * // Create one Inventory
     * const Inventory = await prisma.inventory.create({
     *   data: {
     *     // ... data to create a Inventory
     *   }
     * })
     * 
     */
    create<T extends InventoryCreateArgs>(args: SelectSubset<T, InventoryCreateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Inventories.
     * @param {InventoryCreateManyArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InventoryCreateManyArgs>(args?: SelectSubset<T, InventoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Inventories and returns the data saved in the database.
     * @param {InventoryCreateManyAndReturnArgs} args - Arguments to create many Inventories.
     * @example
     * // Create many Inventories
     * const inventory = await prisma.inventory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Inventories and only return the `id`
     * const inventoryWithIdOnly = await prisma.inventory.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InventoryCreateManyAndReturnArgs>(args?: SelectSubset<T, InventoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Inventory.
     * @param {InventoryDeleteArgs} args - Arguments to delete one Inventory.
     * @example
     * // Delete one Inventory
     * const Inventory = await prisma.inventory.delete({
     *   where: {
     *     // ... filter to delete one Inventory
     *   }
     * })
     * 
     */
    delete<T extends InventoryDeleteArgs>(args: SelectSubset<T, InventoryDeleteArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Inventory.
     * @param {InventoryUpdateArgs} args - Arguments to update one Inventory.
     * @example
     * // Update one Inventory
     * const inventory = await prisma.inventory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InventoryUpdateArgs>(args: SelectSubset<T, InventoryUpdateArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Inventories.
     * @param {InventoryDeleteManyArgs} args - Arguments to filter Inventories to delete.
     * @example
     * // Delete a few Inventories
     * const { count } = await prisma.inventory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InventoryDeleteManyArgs>(args?: SelectSubset<T, InventoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Inventories
     * const inventory = await prisma.inventory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InventoryUpdateManyArgs>(args: SelectSubset<T, InventoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Inventory.
     * @param {InventoryUpsertArgs} args - Arguments to update or create a Inventory.
     * @example
     * // Update or create a Inventory
     * const inventory = await prisma.inventory.upsert({
     *   create: {
     *     // ... data to create a Inventory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Inventory we want to update
     *   }
     * })
     */
    upsert<T extends InventoryUpsertArgs>(args: SelectSubset<T, InventoryUpsertArgs<ExtArgs>>): Prisma__InventoryClient<$Result.GetResult<Prisma.$InventoryPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Inventories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryCountArgs} args - Arguments to filter Inventories to count.
     * @example
     * // Count the number of Inventories
     * const count = await prisma.inventory.count({
     *   where: {
     *     // ... the filter for the Inventories we want to count
     *   }
     * })
    **/
    count<T extends InventoryCountArgs>(
      args?: Subset<T, InventoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InventoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InventoryAggregateArgs>(args: Subset<T, InventoryAggregateArgs>): Prisma.PrismaPromise<GetInventoryAggregateType<T>>

    /**
     * Group by Inventory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InventoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InventoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InventoryGroupByArgs['orderBy'] }
        : { orderBy?: InventoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InventoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInventoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Inventory model
   */
  readonly fields: InventoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Inventory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InventoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sku<T extends SKUDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SKUDefaultArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    shelf<T extends ShelfDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ShelfDefaultArgs<ExtArgs>>): Prisma__ShelfClient<$Result.GetResult<Prisma.$ShelfPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Inventory model
   */ 
  interface InventoryFieldRefs {
    readonly id: FieldRef<"Inventory", 'String'>
    readonly skuId: FieldRef<"Inventory", 'String'>
    readonly shelfId: FieldRef<"Inventory", 'String'>
    readonly quantity: FieldRef<"Inventory", 'Int'>
    readonly qrCode: FieldRef<"Inventory", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Inventory findUnique
   */
  export type InventoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findUniqueOrThrow
   */
  export type InventoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory findFirst
   */
  export type InventoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findFirstOrThrow
   */
  export type InventoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventory to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Inventories.
     */
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory findMany
   */
  export type InventoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter, which Inventories to fetch.
     */
    where?: InventoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Inventories to fetch.
     */
    orderBy?: InventoryOrderByWithRelationInput | InventoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Inventories.
     */
    cursor?: InventoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Inventories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Inventories.
     */
    skip?: number
    distinct?: InventoryScalarFieldEnum | InventoryScalarFieldEnum[]
  }

  /**
   * Inventory create
   */
  export type InventoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to create a Inventory.
     */
    data: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
  }

  /**
   * Inventory createMany
   */
  export type InventoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Inventory createManyAndReturn
   */
  export type InventoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Inventories.
     */
    data: InventoryCreateManyInput | InventoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Inventory update
   */
  export type InventoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The data needed to update a Inventory.
     */
    data: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
    /**
     * Choose, which Inventory to update.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory updateMany
   */
  export type InventoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Inventories.
     */
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyInput>
    /**
     * Filter which Inventories to update
     */
    where?: InventoryWhereInput
  }

  /**
   * Inventory upsert
   */
  export type InventoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * The filter to search for the Inventory to update in case it exists.
     */
    where: InventoryWhereUniqueInput
    /**
     * In case the Inventory found by the `where` argument doesn't exist, create a new Inventory with this data.
     */
    create: XOR<InventoryCreateInput, InventoryUncheckedCreateInput>
    /**
     * In case the Inventory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InventoryUpdateInput, InventoryUncheckedUpdateInput>
  }

  /**
   * Inventory delete
   */
  export type InventoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
    /**
     * Filter which Inventory to delete.
     */
    where: InventoryWhereUniqueInput
  }

  /**
   * Inventory deleteMany
   */
  export type InventoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Inventories to delete
     */
    where?: InventoryWhereInput
  }

  /**
   * Inventory without action
   */
  export type InventoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Inventory
     */
    select?: InventorySelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: InventoryInclude<ExtArgs> | null
  }


  /**
   * Model Transaction
   */

  export type AggregateTransaction = {
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  export type TransactionAvgAggregateOutputType = {
    quantity: number | null
  }

  export type TransactionSumAggregateOutputType = {
    quantity: number | null
  }

  export type TransactionMinAggregateOutputType = {
    id: string | null
    type: $Enums.TxType | null
    skuId: string | null
    quantity: number | null
    rackLocation: string | null
    status: string | null
    timestamp: Date | null
    userId: string | null
    barcodeValue: string | null
    barcodeNumber: string | null
    barcodeImageData: string | null
  }

  export type TransactionMaxAggregateOutputType = {
    id: string | null
    type: $Enums.TxType | null
    skuId: string | null
    quantity: number | null
    rackLocation: string | null
    status: string | null
    timestamp: Date | null
    userId: string | null
    barcodeValue: string | null
    barcodeNumber: string | null
    barcodeImageData: string | null
  }

  export type TransactionCountAggregateOutputType = {
    id: number
    type: number
    skuId: number
    quantity: number
    rackLocation: number
    status: number
    timestamp: number
    userId: number
    barcodeValue: number
    barcodeNumber: number
    barcodeImageData: number
    _all: number
  }


  export type TransactionAvgAggregateInputType = {
    quantity?: true
  }

  export type TransactionSumAggregateInputType = {
    quantity?: true
  }

  export type TransactionMinAggregateInputType = {
    id?: true
    type?: true
    skuId?: true
    quantity?: true
    rackLocation?: true
    status?: true
    timestamp?: true
    userId?: true
    barcodeValue?: true
    barcodeNumber?: true
    barcodeImageData?: true
  }

  export type TransactionMaxAggregateInputType = {
    id?: true
    type?: true
    skuId?: true
    quantity?: true
    rackLocation?: true
    status?: true
    timestamp?: true
    userId?: true
    barcodeValue?: true
    barcodeNumber?: true
    barcodeImageData?: true
  }

  export type TransactionCountAggregateInputType = {
    id?: true
    type?: true
    skuId?: true
    quantity?: true
    rackLocation?: true
    status?: true
    timestamp?: true
    userId?: true
    barcodeValue?: true
    barcodeNumber?: true
    barcodeImageData?: true
    _all?: true
  }

  export type TransactionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaction to aggregate.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transactions
    **/
    _count?: true | TransactionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransactionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransactionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransactionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransactionMaxAggregateInputType
  }

  export type GetTransactionAggregateType<T extends TransactionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaction[P]>
      : GetScalarType<T[P], AggregateTransaction[P]>
  }




  export type TransactionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransactionWhereInput
    orderBy?: TransactionOrderByWithAggregationInput | TransactionOrderByWithAggregationInput[]
    by: TransactionScalarFieldEnum[] | TransactionScalarFieldEnum
    having?: TransactionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransactionCountAggregateInputType | true
    _avg?: TransactionAvgAggregateInputType
    _sum?: TransactionSumAggregateInputType
    _min?: TransactionMinAggregateInputType
    _max?: TransactionMaxAggregateInputType
  }

  export type TransactionGroupByOutputType = {
    id: string
    type: $Enums.TxType
    skuId: string
    quantity: number
    rackLocation: string | null
    status: string
    timestamp: Date
    userId: string | null
    barcodeValue: string | null
    barcodeNumber: string | null
    barcodeImageData: string | null
    _count: TransactionCountAggregateOutputType | null
    _avg: TransactionAvgAggregateOutputType | null
    _sum: TransactionSumAggregateOutputType | null
    _min: TransactionMinAggregateOutputType | null
    _max: TransactionMaxAggregateOutputType | null
  }

  type GetTransactionGroupByPayload<T extends TransactionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransactionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransactionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransactionGroupByOutputType[P]>
            : GetScalarType<T[P], TransactionGroupByOutputType[P]>
        }
      >
    >


  export type TransactionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    skuId?: boolean
    quantity?: boolean
    rackLocation?: boolean
    status?: boolean
    timestamp?: boolean
    userId?: boolean
    barcodeValue?: boolean
    barcodeNumber?: boolean
    barcodeImageData?: boolean
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    user?: boolean | Transaction$userArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    skuId?: boolean
    quantity?: boolean
    rackLocation?: boolean
    status?: boolean
    timestamp?: boolean
    userId?: boolean
    barcodeValue?: boolean
    barcodeNumber?: boolean
    barcodeImageData?: boolean
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    user?: boolean | Transaction$userArgs<ExtArgs>
  }, ExtArgs["result"]["transaction"]>

  export type TransactionSelectScalar = {
    id?: boolean
    type?: boolean
    skuId?: boolean
    quantity?: boolean
    rackLocation?: boolean
    status?: boolean
    timestamp?: boolean
    userId?: boolean
    barcodeValue?: boolean
    barcodeNumber?: boolean
    barcodeImageData?: boolean
  }

  export type TransactionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    user?: boolean | Transaction$userArgs<ExtArgs>
  }
  export type TransactionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    user?: boolean | Transaction$userArgs<ExtArgs>
  }

  export type $TransactionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaction"
    objects: {
      sku: Prisma.$SKUPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: $Enums.TxType
      skuId: string
      quantity: number
      rackLocation: string | null
      status: string
      timestamp: Date
      userId: string | null
      barcodeValue: string | null
      barcodeNumber: string | null
      barcodeImageData: string | null
    }, ExtArgs["result"]["transaction"]>
    composites: {}
  }

  type TransactionGetPayload<S extends boolean | null | undefined | TransactionDefaultArgs> = $Result.GetResult<Prisma.$TransactionPayload, S>

  type TransactionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TransactionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TransactionCountAggregateInputType | true
    }

  export interface TransactionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaction'], meta: { name: 'Transaction' } }
    /**
     * Find zero or one Transaction that matches the filter.
     * @param {TransactionFindUniqueArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransactionFindUniqueArgs>(args: SelectSubset<T, TransactionFindUniqueArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Transaction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TransactionFindUniqueOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransactionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransactionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Transaction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransactionFindFirstArgs>(args?: SelectSubset<T, TransactionFindFirstArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Transaction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindFirstOrThrowArgs} args - Arguments to find a Transaction
     * @example
     * // Get one Transaction
     * const transaction = await prisma.transaction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransactionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransactionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Transactions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transactions
     * const transactions = await prisma.transaction.findMany()
     * 
     * // Get first 10 Transactions
     * const transactions = await prisma.transaction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const transactionWithIdOnly = await prisma.transaction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TransactionFindManyArgs>(args?: SelectSubset<T, TransactionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Transaction.
     * @param {TransactionCreateArgs} args - Arguments to create a Transaction.
     * @example
     * // Create one Transaction
     * const Transaction = await prisma.transaction.create({
     *   data: {
     *     // ... data to create a Transaction
     *   }
     * })
     * 
     */
    create<T extends TransactionCreateArgs>(args: SelectSubset<T, TransactionCreateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Transactions.
     * @param {TransactionCreateManyArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransactionCreateManyArgs>(args?: SelectSubset<T, TransactionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transactions and returns the data saved in the database.
     * @param {TransactionCreateManyAndReturnArgs} args - Arguments to create many Transactions.
     * @example
     * // Create many Transactions
     * const transaction = await prisma.transaction.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transactions and only return the `id`
     * const transactionWithIdOnly = await prisma.transaction.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransactionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransactionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Transaction.
     * @param {TransactionDeleteArgs} args - Arguments to delete one Transaction.
     * @example
     * // Delete one Transaction
     * const Transaction = await prisma.transaction.delete({
     *   where: {
     *     // ... filter to delete one Transaction
     *   }
     * })
     * 
     */
    delete<T extends TransactionDeleteArgs>(args: SelectSubset<T, TransactionDeleteArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Transaction.
     * @param {TransactionUpdateArgs} args - Arguments to update one Transaction.
     * @example
     * // Update one Transaction
     * const transaction = await prisma.transaction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransactionUpdateArgs>(args: SelectSubset<T, TransactionUpdateArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Transactions.
     * @param {TransactionDeleteManyArgs} args - Arguments to filter Transactions to delete.
     * @example
     * // Delete a few Transactions
     * const { count } = await prisma.transaction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransactionDeleteManyArgs>(args?: SelectSubset<T, TransactionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transactions
     * const transaction = await prisma.transaction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransactionUpdateManyArgs>(args: SelectSubset<T, TransactionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Transaction.
     * @param {TransactionUpsertArgs} args - Arguments to update or create a Transaction.
     * @example
     * // Update or create a Transaction
     * const transaction = await prisma.transaction.upsert({
     *   create: {
     *     // ... data to create a Transaction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaction we want to update
     *   }
     * })
     */
    upsert<T extends TransactionUpsertArgs>(args: SelectSubset<T, TransactionUpsertArgs<ExtArgs>>): Prisma__TransactionClient<$Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Transactions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionCountArgs} args - Arguments to filter Transactions to count.
     * @example
     * // Count the number of Transactions
     * const count = await prisma.transaction.count({
     *   where: {
     *     // ... the filter for the Transactions we want to count
     *   }
     * })
    **/
    count<T extends TransactionCountArgs>(
      args?: Subset<T, TransactionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransactionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransactionAggregateArgs>(args: Subset<T, TransactionAggregateArgs>): Prisma.PrismaPromise<GetTransactionAggregateType<T>>

    /**
     * Group by Transaction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransactionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransactionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransactionGroupByArgs['orderBy'] }
        : { orderBy?: TransactionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransactionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransactionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaction model
   */
  readonly fields: TransactionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransactionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sku<T extends SKUDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SKUDefaultArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    user<T extends Transaction$userArgs<ExtArgs> = {}>(args?: Subset<T, Transaction$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaction model
   */ 
  interface TransactionFieldRefs {
    readonly id: FieldRef<"Transaction", 'String'>
    readonly type: FieldRef<"Transaction", 'TxType'>
    readonly skuId: FieldRef<"Transaction", 'String'>
    readonly quantity: FieldRef<"Transaction", 'Int'>
    readonly rackLocation: FieldRef<"Transaction", 'String'>
    readonly status: FieldRef<"Transaction", 'String'>
    readonly timestamp: FieldRef<"Transaction", 'DateTime'>
    readonly userId: FieldRef<"Transaction", 'String'>
    readonly barcodeValue: FieldRef<"Transaction", 'String'>
    readonly barcodeNumber: FieldRef<"Transaction", 'String'>
    readonly barcodeImageData: FieldRef<"Transaction", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Transaction findUnique
   */
  export type TransactionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findUniqueOrThrow
   */
  export type TransactionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction findFirst
   */
  export type TransactionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findFirstOrThrow
   */
  export type TransactionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transaction to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transactions.
     */
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction findMany
   */
  export type TransactionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter, which Transactions to fetch.
     */
    where?: TransactionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transactions to fetch.
     */
    orderBy?: TransactionOrderByWithRelationInput | TransactionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transactions.
     */
    cursor?: TransactionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transactions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transactions.
     */
    skip?: number
    distinct?: TransactionScalarFieldEnum | TransactionScalarFieldEnum[]
  }

  /**
   * Transaction create
   */
  export type TransactionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaction.
     */
    data: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
  }

  /**
   * Transaction createMany
   */
  export type TransactionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaction createManyAndReturn
   */
  export type TransactionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Transactions.
     */
    data: TransactionCreateManyInput | TransactionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaction update
   */
  export type TransactionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaction.
     */
    data: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
    /**
     * Choose, which Transaction to update.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction updateMany
   */
  export type TransactionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transactions.
     */
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyInput>
    /**
     * Filter which Transactions to update
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction upsert
   */
  export type TransactionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaction to update in case it exists.
     */
    where: TransactionWhereUniqueInput
    /**
     * In case the Transaction found by the `where` argument doesn't exist, create a new Transaction with this data.
     */
    create: XOR<TransactionCreateInput, TransactionUncheckedCreateInput>
    /**
     * In case the Transaction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransactionUpdateInput, TransactionUncheckedUpdateInput>
  }

  /**
   * Transaction delete
   */
  export type TransactionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
    /**
     * Filter which Transaction to delete.
     */
    where: TransactionWhereUniqueInput
  }

  /**
   * Transaction deleteMany
   */
  export type TransactionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transactions to delete
     */
    where?: TransactionWhereInput
  }

  /**
   * Transaction.user
   */
  export type Transaction$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Transaction without action
   */
  export type TransactionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaction
     */
    select?: TransactionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransactionInclude<ExtArgs> | null
  }


  /**
   * Model Billing
   */

  export type AggregateBilling = {
    _count: BillingCountAggregateOutputType | null
    _avg: BillingAvgAggregateOutputType | null
    _sum: BillingSumAggregateOutputType | null
    _min: BillingMinAggregateOutputType | null
    _max: BillingMaxAggregateOutputType | null
  }

  export type BillingAvgAggregateOutputType = {
    duration: number | null
    weightCharges: number | null
    rackCharges: number | null
    amount: number | null
    gstPercent: number | null
  }

  export type BillingSumAggregateOutputType = {
    duration: number | null
    weightCharges: number | null
    rackCharges: number | null
    amount: number | null
    gstPercent: number | null
  }

  export type BillingMinAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    orderId: string | null
    skuId: string | null
    productName: string | null
    rackHistory: string | null
    duration: number | null
    weightCharges: number | null
    rackCharges: number | null
    amount: number | null
    status: string | null
    date: string | null
    gstPercent: number | null
    companyName: string | null
    companyGst: string | null
    companyAddr: string | null
    companyEmail: string | null
    companyPhone: string | null
    customerName: string | null
    customerGst: string | null
    customerAddr: string | null
    customerEmail: string | null
    customerPhone: string | null
    customerId: string | null
  }

  export type BillingMaxAggregateOutputType = {
    id: string | null
    invoiceId: string | null
    orderId: string | null
    skuId: string | null
    productName: string | null
    rackHistory: string | null
    duration: number | null
    weightCharges: number | null
    rackCharges: number | null
    amount: number | null
    status: string | null
    date: string | null
    gstPercent: number | null
    companyName: string | null
    companyGst: string | null
    companyAddr: string | null
    companyEmail: string | null
    companyPhone: string | null
    customerName: string | null
    customerGst: string | null
    customerAddr: string | null
    customerEmail: string | null
    customerPhone: string | null
    customerId: string | null
  }

  export type BillingCountAggregateOutputType = {
    id: number
    invoiceId: number
    orderId: number
    skuId: number
    productName: number
    rackHistory: number
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: number
    date: number
    gstPercent: number
    companyName: number
    companyGst: number
    companyAddr: number
    companyEmail: number
    companyPhone: number
    customerName: number
    customerGst: number
    customerAddr: number
    customerEmail: number
    customerPhone: number
    customerId: number
    _all: number
  }


  export type BillingAvgAggregateInputType = {
    duration?: true
    weightCharges?: true
    rackCharges?: true
    amount?: true
    gstPercent?: true
  }

  export type BillingSumAggregateInputType = {
    duration?: true
    weightCharges?: true
    rackCharges?: true
    amount?: true
    gstPercent?: true
  }

  export type BillingMinAggregateInputType = {
    id?: true
    invoiceId?: true
    orderId?: true
    skuId?: true
    productName?: true
    rackHistory?: true
    duration?: true
    weightCharges?: true
    rackCharges?: true
    amount?: true
    status?: true
    date?: true
    gstPercent?: true
    companyName?: true
    companyGst?: true
    companyAddr?: true
    companyEmail?: true
    companyPhone?: true
    customerName?: true
    customerGst?: true
    customerAddr?: true
    customerEmail?: true
    customerPhone?: true
    customerId?: true
  }

  export type BillingMaxAggregateInputType = {
    id?: true
    invoiceId?: true
    orderId?: true
    skuId?: true
    productName?: true
    rackHistory?: true
    duration?: true
    weightCharges?: true
    rackCharges?: true
    amount?: true
    status?: true
    date?: true
    gstPercent?: true
    companyName?: true
    companyGst?: true
    companyAddr?: true
    companyEmail?: true
    companyPhone?: true
    customerName?: true
    customerGst?: true
    customerAddr?: true
    customerEmail?: true
    customerPhone?: true
    customerId?: true
  }

  export type BillingCountAggregateInputType = {
    id?: true
    invoiceId?: true
    orderId?: true
    skuId?: true
    productName?: true
    rackHistory?: true
    duration?: true
    weightCharges?: true
    rackCharges?: true
    amount?: true
    status?: true
    date?: true
    gstPercent?: true
    companyName?: true
    companyGst?: true
    companyAddr?: true
    companyEmail?: true
    companyPhone?: true
    customerName?: true
    customerGst?: true
    customerAddr?: true
    customerEmail?: true
    customerPhone?: true
    customerId?: true
    _all?: true
  }

  export type BillingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Billing to aggregate.
     */
    where?: BillingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Billings to fetch.
     */
    orderBy?: BillingOrderByWithRelationInput | BillingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BillingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Billings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Billings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Billings
    **/
    _count?: true | BillingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BillingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BillingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BillingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BillingMaxAggregateInputType
  }

  export type GetBillingAggregateType<T extends BillingAggregateArgs> = {
        [P in keyof T & keyof AggregateBilling]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBilling[P]>
      : GetScalarType<T[P], AggregateBilling[P]>
  }




  export type BillingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BillingWhereInput
    orderBy?: BillingOrderByWithAggregationInput | BillingOrderByWithAggregationInput[]
    by: BillingScalarFieldEnum[] | BillingScalarFieldEnum
    having?: BillingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BillingCountAggregateInputType | true
    _avg?: BillingAvgAggregateInputType
    _sum?: BillingSumAggregateInputType
    _min?: BillingMinAggregateInputType
    _max?: BillingMaxAggregateInputType
  }

  export type BillingGroupByOutputType = {
    id: string
    invoiceId: string
    orderId: string
    skuId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent: number | null
    companyName: string | null
    companyGst: string | null
    companyAddr: string | null
    companyEmail: string | null
    companyPhone: string | null
    customerName: string | null
    customerGst: string | null
    customerAddr: string | null
    customerEmail: string | null
    customerPhone: string | null
    customerId: string | null
    _count: BillingCountAggregateOutputType | null
    _avg: BillingAvgAggregateOutputType | null
    _sum: BillingSumAggregateOutputType | null
    _min: BillingMinAggregateOutputType | null
    _max: BillingMaxAggregateOutputType | null
  }

  type GetBillingGroupByPayload<T extends BillingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BillingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BillingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BillingGroupByOutputType[P]>
            : GetScalarType<T[P], BillingGroupByOutputType[P]>
        }
      >
    >


  export type BillingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    orderId?: boolean
    skuId?: boolean
    productName?: boolean
    rackHistory?: boolean
    duration?: boolean
    weightCharges?: boolean
    rackCharges?: boolean
    amount?: boolean
    status?: boolean
    date?: boolean
    gstPercent?: boolean
    companyName?: boolean
    companyGst?: boolean
    companyAddr?: boolean
    companyEmail?: boolean
    companyPhone?: boolean
    customerName?: boolean
    customerGst?: boolean
    customerAddr?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    customerId?: boolean
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    customer?: boolean | Billing$customerArgs<ExtArgs>
  }, ExtArgs["result"]["billing"]>

  export type BillingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    invoiceId?: boolean
    orderId?: boolean
    skuId?: boolean
    productName?: boolean
    rackHistory?: boolean
    duration?: boolean
    weightCharges?: boolean
    rackCharges?: boolean
    amount?: boolean
    status?: boolean
    date?: boolean
    gstPercent?: boolean
    companyName?: boolean
    companyGst?: boolean
    companyAddr?: boolean
    companyEmail?: boolean
    companyPhone?: boolean
    customerName?: boolean
    customerGst?: boolean
    customerAddr?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    customerId?: boolean
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    customer?: boolean | Billing$customerArgs<ExtArgs>
  }, ExtArgs["result"]["billing"]>

  export type BillingSelectScalar = {
    id?: boolean
    invoiceId?: boolean
    orderId?: boolean
    skuId?: boolean
    productName?: boolean
    rackHistory?: boolean
    duration?: boolean
    weightCharges?: boolean
    rackCharges?: boolean
    amount?: boolean
    status?: boolean
    date?: boolean
    gstPercent?: boolean
    companyName?: boolean
    companyGst?: boolean
    companyAddr?: boolean
    companyEmail?: boolean
    companyPhone?: boolean
    customerName?: boolean
    customerGst?: boolean
    customerAddr?: boolean
    customerEmail?: boolean
    customerPhone?: boolean
    customerId?: boolean
  }

  export type BillingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    customer?: boolean | Billing$customerArgs<ExtArgs>
  }
  export type BillingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sku?: boolean | SKUDefaultArgs<ExtArgs>
    customer?: boolean | Billing$customerArgs<ExtArgs>
  }

  export type $BillingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Billing"
    objects: {
      sku: Prisma.$SKUPayload<ExtArgs>
      customer: Prisma.$CustomerPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      invoiceId: string
      orderId: string
      skuId: string
      productName: string
      rackHistory: string
      duration: number
      weightCharges: number
      rackCharges: number
      amount: number
      status: string
      date: string
      gstPercent: number | null
      companyName: string | null
      companyGst: string | null
      companyAddr: string | null
      companyEmail: string | null
      companyPhone: string | null
      customerName: string | null
      customerGst: string | null
      customerAddr: string | null
      customerEmail: string | null
      customerPhone: string | null
      customerId: string | null
    }, ExtArgs["result"]["billing"]>
    composites: {}
  }

  type BillingGetPayload<S extends boolean | null | undefined | BillingDefaultArgs> = $Result.GetResult<Prisma.$BillingPayload, S>

  type BillingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<BillingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: BillingCountAggregateInputType | true
    }

  export interface BillingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Billing'], meta: { name: 'Billing' } }
    /**
     * Find zero or one Billing that matches the filter.
     * @param {BillingFindUniqueArgs} args - Arguments to find a Billing
     * @example
     * // Get one Billing
     * const billing = await prisma.billing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BillingFindUniqueArgs>(args: SelectSubset<T, BillingFindUniqueArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Billing that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {BillingFindUniqueOrThrowArgs} args - Arguments to find a Billing
     * @example
     * // Get one Billing
     * const billing = await prisma.billing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BillingFindUniqueOrThrowArgs>(args: SelectSubset<T, BillingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Billing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingFindFirstArgs} args - Arguments to find a Billing
     * @example
     * // Get one Billing
     * const billing = await prisma.billing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BillingFindFirstArgs>(args?: SelectSubset<T, BillingFindFirstArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Billing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingFindFirstOrThrowArgs} args - Arguments to find a Billing
     * @example
     * // Get one Billing
     * const billing = await prisma.billing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BillingFindFirstOrThrowArgs>(args?: SelectSubset<T, BillingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Billings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Billings
     * const billings = await prisma.billing.findMany()
     * 
     * // Get first 10 Billings
     * const billings = await prisma.billing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const billingWithIdOnly = await prisma.billing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BillingFindManyArgs>(args?: SelectSubset<T, BillingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Billing.
     * @param {BillingCreateArgs} args - Arguments to create a Billing.
     * @example
     * // Create one Billing
     * const Billing = await prisma.billing.create({
     *   data: {
     *     // ... data to create a Billing
     *   }
     * })
     * 
     */
    create<T extends BillingCreateArgs>(args: SelectSubset<T, BillingCreateArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Billings.
     * @param {BillingCreateManyArgs} args - Arguments to create many Billings.
     * @example
     * // Create many Billings
     * const billing = await prisma.billing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BillingCreateManyArgs>(args?: SelectSubset<T, BillingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Billings and returns the data saved in the database.
     * @param {BillingCreateManyAndReturnArgs} args - Arguments to create many Billings.
     * @example
     * // Create many Billings
     * const billing = await prisma.billing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Billings and only return the `id`
     * const billingWithIdOnly = await prisma.billing.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BillingCreateManyAndReturnArgs>(args?: SelectSubset<T, BillingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Billing.
     * @param {BillingDeleteArgs} args - Arguments to delete one Billing.
     * @example
     * // Delete one Billing
     * const Billing = await prisma.billing.delete({
     *   where: {
     *     // ... filter to delete one Billing
     *   }
     * })
     * 
     */
    delete<T extends BillingDeleteArgs>(args: SelectSubset<T, BillingDeleteArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Billing.
     * @param {BillingUpdateArgs} args - Arguments to update one Billing.
     * @example
     * // Update one Billing
     * const billing = await prisma.billing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BillingUpdateArgs>(args: SelectSubset<T, BillingUpdateArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Billings.
     * @param {BillingDeleteManyArgs} args - Arguments to filter Billings to delete.
     * @example
     * // Delete a few Billings
     * const { count } = await prisma.billing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BillingDeleteManyArgs>(args?: SelectSubset<T, BillingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Billings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Billings
     * const billing = await prisma.billing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BillingUpdateManyArgs>(args: SelectSubset<T, BillingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Billing.
     * @param {BillingUpsertArgs} args - Arguments to update or create a Billing.
     * @example
     * // Update or create a Billing
     * const billing = await prisma.billing.upsert({
     *   create: {
     *     // ... data to create a Billing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Billing we want to update
     *   }
     * })
     */
    upsert<T extends BillingUpsertArgs>(args: SelectSubset<T, BillingUpsertArgs<ExtArgs>>): Prisma__BillingClient<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Billings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingCountArgs} args - Arguments to filter Billings to count.
     * @example
     * // Count the number of Billings
     * const count = await prisma.billing.count({
     *   where: {
     *     // ... the filter for the Billings we want to count
     *   }
     * })
    **/
    count<T extends BillingCountArgs>(
      args?: Subset<T, BillingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BillingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Billing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends BillingAggregateArgs>(args: Subset<T, BillingAggregateArgs>): Prisma.PrismaPromise<GetBillingAggregateType<T>>

    /**
     * Group by Billing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BillingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends BillingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BillingGroupByArgs['orderBy'] }
        : { orderBy?: BillingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, BillingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBillingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Billing model
   */
  readonly fields: BillingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Billing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BillingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sku<T extends SKUDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SKUDefaultArgs<ExtArgs>>): Prisma__SKUClient<$Result.GetResult<Prisma.$SKUPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    customer<T extends Billing$customerArgs<ExtArgs> = {}>(args?: Subset<T, Billing$customerArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Billing model
   */ 
  interface BillingFieldRefs {
    readonly id: FieldRef<"Billing", 'String'>
    readonly invoiceId: FieldRef<"Billing", 'String'>
    readonly orderId: FieldRef<"Billing", 'String'>
    readonly skuId: FieldRef<"Billing", 'String'>
    readonly productName: FieldRef<"Billing", 'String'>
    readonly rackHistory: FieldRef<"Billing", 'String'>
    readonly duration: FieldRef<"Billing", 'Int'>
    readonly weightCharges: FieldRef<"Billing", 'Float'>
    readonly rackCharges: FieldRef<"Billing", 'Float'>
    readonly amount: FieldRef<"Billing", 'Float'>
    readonly status: FieldRef<"Billing", 'String'>
    readonly date: FieldRef<"Billing", 'String'>
    readonly gstPercent: FieldRef<"Billing", 'Float'>
    readonly companyName: FieldRef<"Billing", 'String'>
    readonly companyGst: FieldRef<"Billing", 'String'>
    readonly companyAddr: FieldRef<"Billing", 'String'>
    readonly companyEmail: FieldRef<"Billing", 'String'>
    readonly companyPhone: FieldRef<"Billing", 'String'>
    readonly customerName: FieldRef<"Billing", 'String'>
    readonly customerGst: FieldRef<"Billing", 'String'>
    readonly customerAddr: FieldRef<"Billing", 'String'>
    readonly customerEmail: FieldRef<"Billing", 'String'>
    readonly customerPhone: FieldRef<"Billing", 'String'>
    readonly customerId: FieldRef<"Billing", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Billing findUnique
   */
  export type BillingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * Filter, which Billing to fetch.
     */
    where: BillingWhereUniqueInput
  }

  /**
   * Billing findUniqueOrThrow
   */
  export type BillingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * Filter, which Billing to fetch.
     */
    where: BillingWhereUniqueInput
  }

  /**
   * Billing findFirst
   */
  export type BillingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * Filter, which Billing to fetch.
     */
    where?: BillingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Billings to fetch.
     */
    orderBy?: BillingOrderByWithRelationInput | BillingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Billings.
     */
    cursor?: BillingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Billings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Billings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Billings.
     */
    distinct?: BillingScalarFieldEnum | BillingScalarFieldEnum[]
  }

  /**
   * Billing findFirstOrThrow
   */
  export type BillingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * Filter, which Billing to fetch.
     */
    where?: BillingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Billings to fetch.
     */
    orderBy?: BillingOrderByWithRelationInput | BillingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Billings.
     */
    cursor?: BillingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Billings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Billings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Billings.
     */
    distinct?: BillingScalarFieldEnum | BillingScalarFieldEnum[]
  }

  /**
   * Billing findMany
   */
  export type BillingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * Filter, which Billings to fetch.
     */
    where?: BillingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Billings to fetch.
     */
    orderBy?: BillingOrderByWithRelationInput | BillingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Billings.
     */
    cursor?: BillingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Billings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Billings.
     */
    skip?: number
    distinct?: BillingScalarFieldEnum | BillingScalarFieldEnum[]
  }

  /**
   * Billing create
   */
  export type BillingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * The data needed to create a Billing.
     */
    data: XOR<BillingCreateInput, BillingUncheckedCreateInput>
  }

  /**
   * Billing createMany
   */
  export type BillingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Billings.
     */
    data: BillingCreateManyInput | BillingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Billing createManyAndReturn
   */
  export type BillingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Billings.
     */
    data: BillingCreateManyInput | BillingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Billing update
   */
  export type BillingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * The data needed to update a Billing.
     */
    data: XOR<BillingUpdateInput, BillingUncheckedUpdateInput>
    /**
     * Choose, which Billing to update.
     */
    where: BillingWhereUniqueInput
  }

  /**
   * Billing updateMany
   */
  export type BillingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Billings.
     */
    data: XOR<BillingUpdateManyMutationInput, BillingUncheckedUpdateManyInput>
    /**
     * Filter which Billings to update
     */
    where?: BillingWhereInput
  }

  /**
   * Billing upsert
   */
  export type BillingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * The filter to search for the Billing to update in case it exists.
     */
    where: BillingWhereUniqueInput
    /**
     * In case the Billing found by the `where` argument doesn't exist, create a new Billing with this data.
     */
    create: XOR<BillingCreateInput, BillingUncheckedCreateInput>
    /**
     * In case the Billing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BillingUpdateInput, BillingUncheckedUpdateInput>
  }

  /**
   * Billing delete
   */
  export type BillingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    /**
     * Filter which Billing to delete.
     */
    where: BillingWhereUniqueInput
  }

  /**
   * Billing deleteMany
   */
  export type BillingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Billings to delete
     */
    where?: BillingWhereInput
  }

  /**
   * Billing.customer
   */
  export type Billing$customerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    where?: CustomerWhereInput
  }

  /**
   * Billing without action
   */
  export type BillingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
  }


  /**
   * Model Customer
   */

  export type AggregateCustomer = {
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  export type CustomerMinAggregateOutputType = {
    id: string | null
    name: string | null
    gstNumber: string | null
    address: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
  }

  export type CustomerMaxAggregateOutputType = {
    id: string | null
    name: string | null
    gstNumber: string | null
    address: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
  }

  export type CustomerCountAggregateOutputType = {
    id: number
    name: number
    gstNumber: number
    address: number
    email: number
    phone: number
    createdAt: number
    _all: number
  }


  export type CustomerMinAggregateInputType = {
    id?: true
    name?: true
    gstNumber?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
  }

  export type CustomerMaxAggregateInputType = {
    id?: true
    name?: true
    gstNumber?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
  }

  export type CustomerCountAggregateInputType = {
    id?: true
    name?: true
    gstNumber?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
    _all?: true
  }

  export type CustomerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customer to aggregate.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Customers
    **/
    _count?: true | CustomerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomerMaxAggregateInputType
  }

  export type GetCustomerAggregateType<T extends CustomerAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomer[P]>
      : GetScalarType<T[P], AggregateCustomer[P]>
  }




  export type CustomerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomerWhereInput
    orderBy?: CustomerOrderByWithAggregationInput | CustomerOrderByWithAggregationInput[]
    by: CustomerScalarFieldEnum[] | CustomerScalarFieldEnum
    having?: CustomerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomerCountAggregateInputType | true
    _min?: CustomerMinAggregateInputType
    _max?: CustomerMaxAggregateInputType
  }

  export type CustomerGroupByOutputType = {
    id: string
    name: string
    gstNumber: string | null
    address: string
    email: string | null
    phone: string | null
    createdAt: Date
    _count: CustomerCountAggregateOutputType | null
    _min: CustomerMinAggregateOutputType | null
    _max: CustomerMaxAggregateOutputType | null
  }

  type GetCustomerGroupByPayload<T extends CustomerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomerGroupByOutputType[P]>
            : GetScalarType<T[P], CustomerGroupByOutputType[P]>
        }
      >
    >


  export type CustomerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gstNumber?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
    billings?: boolean | Customer$billingsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gstNumber?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["customer"]>

  export type CustomerSelectScalar = {
    id?: boolean
    name?: boolean
    gstNumber?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
  }

  export type CustomerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    billings?: boolean | Customer$billingsArgs<ExtArgs>
    _count?: boolean | CustomerCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CustomerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CustomerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Customer"
    objects: {
      billings: Prisma.$BillingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      gstNumber: string | null
      address: string
      email: string | null
      phone: string | null
      createdAt: Date
    }, ExtArgs["result"]["customer"]>
    composites: {}
  }

  type CustomerGetPayload<S extends boolean | null | undefined | CustomerDefaultArgs> = $Result.GetResult<Prisma.$CustomerPayload, S>

  type CustomerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomerFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomerCountAggregateInputType | true
    }

  export interface CustomerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Customer'], meta: { name: 'Customer' } }
    /**
     * Find zero or one Customer that matches the filter.
     * @param {CustomerFindUniqueArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomerFindUniqueArgs>(args: SelectSubset<T, CustomerFindUniqueArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Customer that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomerFindUniqueOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomerFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Customer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomerFindFirstArgs>(args?: SelectSubset<T, CustomerFindFirstArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Customer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindFirstOrThrowArgs} args - Arguments to find a Customer
     * @example
     * // Get one Customer
     * const customer = await prisma.customer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomerFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomerFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Customers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Customers
     * const customers = await prisma.customer.findMany()
     * 
     * // Get first 10 Customers
     * const customers = await prisma.customer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customerWithIdOnly = await prisma.customer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomerFindManyArgs>(args?: SelectSubset<T, CustomerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Customer.
     * @param {CustomerCreateArgs} args - Arguments to create a Customer.
     * @example
     * // Create one Customer
     * const Customer = await prisma.customer.create({
     *   data: {
     *     // ... data to create a Customer
     *   }
     * })
     * 
     */
    create<T extends CustomerCreateArgs>(args: SelectSubset<T, CustomerCreateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Customers.
     * @param {CustomerCreateManyArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomerCreateManyArgs>(args?: SelectSubset<T, CustomerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Customers and returns the data saved in the database.
     * @param {CustomerCreateManyAndReturnArgs} args - Arguments to create many Customers.
     * @example
     * // Create many Customers
     * const customer = await prisma.customer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Customers and only return the `id`
     * const customerWithIdOnly = await prisma.customer.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CustomerCreateManyAndReturnArgs>(args?: SelectSubset<T, CustomerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Customer.
     * @param {CustomerDeleteArgs} args - Arguments to delete one Customer.
     * @example
     * // Delete one Customer
     * const Customer = await prisma.customer.delete({
     *   where: {
     *     // ... filter to delete one Customer
     *   }
     * })
     * 
     */
    delete<T extends CustomerDeleteArgs>(args: SelectSubset<T, CustomerDeleteArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Customer.
     * @param {CustomerUpdateArgs} args - Arguments to update one Customer.
     * @example
     * // Update one Customer
     * const customer = await prisma.customer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomerUpdateArgs>(args: SelectSubset<T, CustomerUpdateArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Customers.
     * @param {CustomerDeleteManyArgs} args - Arguments to filter Customers to delete.
     * @example
     * // Delete a few Customers
     * const { count } = await prisma.customer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomerDeleteManyArgs>(args?: SelectSubset<T, CustomerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Customers
     * const customer = await prisma.customer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomerUpdateManyArgs>(args: SelectSubset<T, CustomerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Customer.
     * @param {CustomerUpsertArgs} args - Arguments to update or create a Customer.
     * @example
     * // Update or create a Customer
     * const customer = await prisma.customer.upsert({
     *   create: {
     *     // ... data to create a Customer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Customer we want to update
     *   }
     * })
     */
    upsert<T extends CustomerUpsertArgs>(args: SelectSubset<T, CustomerUpsertArgs<ExtArgs>>): Prisma__CustomerClient<$Result.GetResult<Prisma.$CustomerPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Customers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerCountArgs} args - Arguments to filter Customers to count.
     * @example
     * // Count the number of Customers
     * const count = await prisma.customer.count({
     *   where: {
     *     // ... the filter for the Customers we want to count
     *   }
     * })
    **/
    count<T extends CustomerCountArgs>(
      args?: Subset<T, CustomerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomerAggregateArgs>(args: Subset<T, CustomerAggregateArgs>): Prisma.PrismaPromise<GetCustomerAggregateType<T>>

    /**
     * Group by Customer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomerGroupByArgs['orderBy'] }
        : { orderBy?: CustomerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Customer model
   */
  readonly fields: CustomerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Customer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    billings<T extends Customer$billingsArgs<ExtArgs> = {}>(args?: Subset<T, Customer$billingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BillingPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Customer model
   */ 
  interface CustomerFieldRefs {
    readonly id: FieldRef<"Customer", 'String'>
    readonly name: FieldRef<"Customer", 'String'>
    readonly gstNumber: FieldRef<"Customer", 'String'>
    readonly address: FieldRef<"Customer", 'String'>
    readonly email: FieldRef<"Customer", 'String'>
    readonly phone: FieldRef<"Customer", 'String'>
    readonly createdAt: FieldRef<"Customer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Customer findUnique
   */
  export type CustomerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findUniqueOrThrow
   */
  export type CustomerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer findFirst
   */
  export type CustomerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findFirstOrThrow
   */
  export type CustomerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customer to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Customers.
     */
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer findMany
   */
  export type CustomerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter, which Customers to fetch.
     */
    where?: CustomerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Customers to fetch.
     */
    orderBy?: CustomerOrderByWithRelationInput | CustomerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Customers.
     */
    cursor?: CustomerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Customers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Customers.
     */
    skip?: number
    distinct?: CustomerScalarFieldEnum | CustomerScalarFieldEnum[]
  }

  /**
   * Customer create
   */
  export type CustomerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to create a Customer.
     */
    data: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
  }

  /**
   * Customer createMany
   */
  export type CustomerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer createManyAndReturn
   */
  export type CustomerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Customers.
     */
    data: CustomerCreateManyInput | CustomerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Customer update
   */
  export type CustomerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The data needed to update a Customer.
     */
    data: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
    /**
     * Choose, which Customer to update.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer updateMany
   */
  export type CustomerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Customers.
     */
    data: XOR<CustomerUpdateManyMutationInput, CustomerUncheckedUpdateManyInput>
    /**
     * Filter which Customers to update
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer upsert
   */
  export type CustomerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * The filter to search for the Customer to update in case it exists.
     */
    where: CustomerWhereUniqueInput
    /**
     * In case the Customer found by the `where` argument doesn't exist, create a new Customer with this data.
     */
    create: XOR<CustomerCreateInput, CustomerUncheckedCreateInput>
    /**
     * In case the Customer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomerUpdateInput, CustomerUncheckedUpdateInput>
  }

  /**
   * Customer delete
   */
  export type CustomerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
    /**
     * Filter which Customer to delete.
     */
    where: CustomerWhereUniqueInput
  }

  /**
   * Customer deleteMany
   */
  export type CustomerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Customers to delete
     */
    where?: CustomerWhereInput
  }

  /**
   * Customer.billings
   */
  export type Customer$billingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Billing
     */
    select?: BillingSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BillingInclude<ExtArgs> | null
    where?: BillingWhereInput
    orderBy?: BillingOrderByWithRelationInput | BillingOrderByWithRelationInput[]
    cursor?: BillingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BillingScalarFieldEnum | BillingScalarFieldEnum[]
  }

  /**
   * Customer without action
   */
  export type CustomerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Customer
     */
    select?: CustomerSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CustomerInclude<ExtArgs> | null
  }


  /**
   * Model CompanySetting
   */

  export type AggregateCompanySetting = {
    _count: CompanySettingCountAggregateOutputType | null
    _min: CompanySettingMinAggregateOutputType | null
    _max: CompanySettingMaxAggregateOutputType | null
  }

  export type CompanySettingMinAggregateOutputType = {
    id: string | null
    name: string | null
    gstin: string | null
    address: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
  }

  export type CompanySettingMaxAggregateOutputType = {
    id: string | null
    name: string | null
    gstin: string | null
    address: string | null
    email: string | null
    phone: string | null
    createdAt: Date | null
  }

  export type CompanySettingCountAggregateOutputType = {
    id: number
    name: number
    gstin: number
    address: number
    email: number
    phone: number
    createdAt: number
    _all: number
  }


  export type CompanySettingMinAggregateInputType = {
    id?: true
    name?: true
    gstin?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
  }

  export type CompanySettingMaxAggregateInputType = {
    id?: true
    name?: true
    gstin?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
  }

  export type CompanySettingCountAggregateInputType = {
    id?: true
    name?: true
    gstin?: true
    address?: true
    email?: true
    phone?: true
    createdAt?: true
    _all?: true
  }

  export type CompanySettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanySetting to aggregate.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CompanySettings
    **/
    _count?: true | CompanySettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanySettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanySettingMaxAggregateInputType
  }

  export type GetCompanySettingAggregateType<T extends CompanySettingAggregateArgs> = {
        [P in keyof T & keyof AggregateCompanySetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompanySetting[P]>
      : GetScalarType<T[P], AggregateCompanySetting[P]>
  }




  export type CompanySettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanySettingWhereInput
    orderBy?: CompanySettingOrderByWithAggregationInput | CompanySettingOrderByWithAggregationInput[]
    by: CompanySettingScalarFieldEnum[] | CompanySettingScalarFieldEnum
    having?: CompanySettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanySettingCountAggregateInputType | true
    _min?: CompanySettingMinAggregateInputType
    _max?: CompanySettingMaxAggregateInputType
  }

  export type CompanySettingGroupByOutputType = {
    id: string
    name: string
    gstin: string
    address: string
    email: string | null
    phone: string | null
    createdAt: Date
    _count: CompanySettingCountAggregateOutputType | null
    _min: CompanySettingMinAggregateOutputType | null
    _max: CompanySettingMaxAggregateOutputType | null
  }

  type GetCompanySettingGroupByPayload<T extends CompanySettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanySettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanySettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanySettingGroupByOutputType[P]>
            : GetScalarType<T[P], CompanySettingGroupByOutputType[P]>
        }
      >
    >


  export type CompanySettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gstin?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["companySetting"]>

  export type CompanySettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    gstin?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["companySetting"]>

  export type CompanySettingSelectScalar = {
    id?: boolean
    name?: boolean
    gstin?: boolean
    address?: boolean
    email?: boolean
    phone?: boolean
    createdAt?: boolean
  }


  export type $CompanySettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CompanySetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      gstin: string
      address: string
      email: string | null
      phone: string | null
      createdAt: Date
    }, ExtArgs["result"]["companySetting"]>
    composites: {}
  }

  type CompanySettingGetPayload<S extends boolean | null | undefined | CompanySettingDefaultArgs> = $Result.GetResult<Prisma.$CompanySettingPayload, S>

  type CompanySettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CompanySettingFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CompanySettingCountAggregateInputType | true
    }

  export interface CompanySettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CompanySetting'], meta: { name: 'CompanySetting' } }
    /**
     * Find zero or one CompanySetting that matches the filter.
     * @param {CompanySettingFindUniqueArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanySettingFindUniqueArgs>(args: SelectSubset<T, CompanySettingFindUniqueArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CompanySetting that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CompanySettingFindUniqueOrThrowArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanySettingFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanySettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CompanySetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingFindFirstArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanySettingFindFirstArgs>(args?: SelectSubset<T, CompanySettingFindFirstArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CompanySetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingFindFirstOrThrowArgs} args - Arguments to find a CompanySetting
     * @example
     * // Get one CompanySetting
     * const companySetting = await prisma.companySetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanySettingFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanySettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CompanySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CompanySettings
     * const companySettings = await prisma.companySetting.findMany()
     * 
     * // Get first 10 CompanySettings
     * const companySettings = await prisma.companySetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companySettingWithIdOnly = await prisma.companySetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanySettingFindManyArgs>(args?: SelectSubset<T, CompanySettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CompanySetting.
     * @param {CompanySettingCreateArgs} args - Arguments to create a CompanySetting.
     * @example
     * // Create one CompanySetting
     * const CompanySetting = await prisma.companySetting.create({
     *   data: {
     *     // ... data to create a CompanySetting
     *   }
     * })
     * 
     */
    create<T extends CompanySettingCreateArgs>(args: SelectSubset<T, CompanySettingCreateArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CompanySettings.
     * @param {CompanySettingCreateManyArgs} args - Arguments to create many CompanySettings.
     * @example
     * // Create many CompanySettings
     * const companySetting = await prisma.companySetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanySettingCreateManyArgs>(args?: SelectSubset<T, CompanySettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many CompanySettings and returns the data saved in the database.
     * @param {CompanySettingCreateManyAndReturnArgs} args - Arguments to create many CompanySettings.
     * @example
     * // Create many CompanySettings
     * const companySetting = await prisma.companySetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many CompanySettings and only return the `id`
     * const companySettingWithIdOnly = await prisma.companySetting.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanySettingCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanySettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a CompanySetting.
     * @param {CompanySettingDeleteArgs} args - Arguments to delete one CompanySetting.
     * @example
     * // Delete one CompanySetting
     * const CompanySetting = await prisma.companySetting.delete({
     *   where: {
     *     // ... filter to delete one CompanySetting
     *   }
     * })
     * 
     */
    delete<T extends CompanySettingDeleteArgs>(args: SelectSubset<T, CompanySettingDeleteArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CompanySetting.
     * @param {CompanySettingUpdateArgs} args - Arguments to update one CompanySetting.
     * @example
     * // Update one CompanySetting
     * const companySetting = await prisma.companySetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanySettingUpdateArgs>(args: SelectSubset<T, CompanySettingUpdateArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CompanySettings.
     * @param {CompanySettingDeleteManyArgs} args - Arguments to filter CompanySettings to delete.
     * @example
     * // Delete a few CompanySettings
     * const { count } = await prisma.companySetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanySettingDeleteManyArgs>(args?: SelectSubset<T, CompanySettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CompanySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CompanySettings
     * const companySetting = await prisma.companySetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanySettingUpdateManyArgs>(args: SelectSubset<T, CompanySettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CompanySetting.
     * @param {CompanySettingUpsertArgs} args - Arguments to update or create a CompanySetting.
     * @example
     * // Update or create a CompanySetting
     * const companySetting = await prisma.companySetting.upsert({
     *   create: {
     *     // ... data to create a CompanySetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CompanySetting we want to update
     *   }
     * })
     */
    upsert<T extends CompanySettingUpsertArgs>(args: SelectSubset<T, CompanySettingUpsertArgs<ExtArgs>>): Prisma__CompanySettingClient<$Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CompanySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingCountArgs} args - Arguments to filter CompanySettings to count.
     * @example
     * // Count the number of CompanySettings
     * const count = await prisma.companySetting.count({
     *   where: {
     *     // ... the filter for the CompanySettings we want to count
     *   }
     * })
    **/
    count<T extends CompanySettingCountArgs>(
      args?: Subset<T, CompanySettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanySettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CompanySetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompanySettingAggregateArgs>(args: Subset<T, CompanySettingAggregateArgs>): Prisma.PrismaPromise<GetCompanySettingAggregateType<T>>

    /**
     * Group by CompanySetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanySettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CompanySettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanySettingGroupByArgs['orderBy'] }
        : { orderBy?: CompanySettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CompanySettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanySettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CompanySetting model
   */
  readonly fields: CompanySettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CompanySetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanySettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CompanySetting model
   */ 
  interface CompanySettingFieldRefs {
    readonly id: FieldRef<"CompanySetting", 'String'>
    readonly name: FieldRef<"CompanySetting", 'String'>
    readonly gstin: FieldRef<"CompanySetting", 'String'>
    readonly address: FieldRef<"CompanySetting", 'String'>
    readonly email: FieldRef<"CompanySetting", 'String'>
    readonly phone: FieldRef<"CompanySetting", 'String'>
    readonly createdAt: FieldRef<"CompanySetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CompanySetting findUnique
   */
  export type CompanySettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting findUniqueOrThrow
   */
  export type CompanySettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting findFirst
   */
  export type CompanySettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanySettings.
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanySettings.
     */
    distinct?: CompanySettingScalarFieldEnum | CompanySettingScalarFieldEnum[]
  }

  /**
   * CompanySetting findFirstOrThrow
   */
  export type CompanySettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Filter, which CompanySetting to fetch.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CompanySettings.
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CompanySettings.
     */
    distinct?: CompanySettingScalarFieldEnum | CompanySettingScalarFieldEnum[]
  }

  /**
   * CompanySetting findMany
   */
  export type CompanySettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Filter, which CompanySettings to fetch.
     */
    where?: CompanySettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CompanySettings to fetch.
     */
    orderBy?: CompanySettingOrderByWithRelationInput | CompanySettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CompanySettings.
     */
    cursor?: CompanySettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CompanySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CompanySettings.
     */
    skip?: number
    distinct?: CompanySettingScalarFieldEnum | CompanySettingScalarFieldEnum[]
  }

  /**
   * CompanySetting create
   */
  export type CompanySettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * The data needed to create a CompanySetting.
     */
    data: XOR<CompanySettingCreateInput, CompanySettingUncheckedCreateInput>
  }

  /**
   * CompanySetting createMany
   */
  export type CompanySettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CompanySettings.
     */
    data: CompanySettingCreateManyInput | CompanySettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompanySetting createManyAndReturn
   */
  export type CompanySettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many CompanySettings.
     */
    data: CompanySettingCreateManyInput | CompanySettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CompanySetting update
   */
  export type CompanySettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * The data needed to update a CompanySetting.
     */
    data: XOR<CompanySettingUpdateInput, CompanySettingUncheckedUpdateInput>
    /**
     * Choose, which CompanySetting to update.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting updateMany
   */
  export type CompanySettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CompanySettings.
     */
    data: XOR<CompanySettingUpdateManyMutationInput, CompanySettingUncheckedUpdateManyInput>
    /**
     * Filter which CompanySettings to update
     */
    where?: CompanySettingWhereInput
  }

  /**
   * CompanySetting upsert
   */
  export type CompanySettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * The filter to search for the CompanySetting to update in case it exists.
     */
    where: CompanySettingWhereUniqueInput
    /**
     * In case the CompanySetting found by the `where` argument doesn't exist, create a new CompanySetting with this data.
     */
    create: XOR<CompanySettingCreateInput, CompanySettingUncheckedCreateInput>
    /**
     * In case the CompanySetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanySettingUpdateInput, CompanySettingUncheckedUpdateInput>
  }

  /**
   * CompanySetting delete
   */
  export type CompanySettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
    /**
     * Filter which CompanySetting to delete.
     */
    where: CompanySettingWhereUniqueInput
  }

  /**
   * CompanySetting deleteMany
   */
  export type CompanySettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CompanySettings to delete
     */
    where?: CompanySettingWhereInput
  }

  /**
   * CompanySetting without action
   */
  export type CompanySettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanySetting
     */
    select?: CompanySettingSelect<ExtArgs> | null
  }


  /**
   * Model Module
   */

  export type AggregateModule = {
    _count: ModuleCountAggregateOutputType | null
    _min: ModuleMinAggregateOutputType | null
    _max: ModuleMaxAggregateOutputType | null
  }

  export type ModuleMinAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type ModuleMaxAggregateOutputType = {
    id: string | null
    name: string | null
  }

  export type ModuleCountAggregateOutputType = {
    id: number
    name: number
    _all: number
  }


  export type ModuleMinAggregateInputType = {
    id?: true
    name?: true
  }

  export type ModuleMaxAggregateInputType = {
    id?: true
    name?: true
  }

  export type ModuleCountAggregateInputType = {
    id?: true
    name?: true
    _all?: true
  }

  export type ModuleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Module to aggregate.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Modules
    **/
    _count?: true | ModuleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ModuleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ModuleMaxAggregateInputType
  }

  export type GetModuleAggregateType<T extends ModuleAggregateArgs> = {
        [P in keyof T & keyof AggregateModule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateModule[P]>
      : GetScalarType<T[P], AggregateModule[P]>
  }




  export type ModuleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ModuleWhereInput
    orderBy?: ModuleOrderByWithAggregationInput | ModuleOrderByWithAggregationInput[]
    by: ModuleScalarFieldEnum[] | ModuleScalarFieldEnum
    having?: ModuleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ModuleCountAggregateInputType | true
    _min?: ModuleMinAggregateInputType
    _max?: ModuleMaxAggregateInputType
  }

  export type ModuleGroupByOutputType = {
    id: string
    name: string
    _count: ModuleCountAggregateOutputType | null
    _min: ModuleMinAggregateOutputType | null
    _max: ModuleMaxAggregateOutputType | null
  }

  type GetModuleGroupByPayload<T extends ModuleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ModuleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ModuleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ModuleGroupByOutputType[P]>
            : GetScalarType<T[P], ModuleGroupByOutputType[P]>
        }
      >
    >


  export type ModuleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    permissions?: boolean | Module$permissionsArgs<ExtArgs>
    _count?: boolean | ModuleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
  }, ExtArgs["result"]["module"]>

  export type ModuleSelectScalar = {
    id?: boolean
    name?: boolean
  }

  export type ModuleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    permissions?: boolean | Module$permissionsArgs<ExtArgs>
    _count?: boolean | ModuleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ModuleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ModulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Module"
    objects: {
      permissions: Prisma.$PermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
    }, ExtArgs["result"]["module"]>
    composites: {}
  }

  type ModuleGetPayload<S extends boolean | null | undefined | ModuleDefaultArgs> = $Result.GetResult<Prisma.$ModulePayload, S>

  type ModuleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ModuleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ModuleCountAggregateInputType | true
    }

  export interface ModuleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Module'], meta: { name: 'Module' } }
    /**
     * Find zero or one Module that matches the filter.
     * @param {ModuleFindUniqueArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ModuleFindUniqueArgs>(args: SelectSubset<T, ModuleFindUniqueArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Module that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ModuleFindUniqueOrThrowArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ModuleFindUniqueOrThrowArgs>(args: SelectSubset<T, ModuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Module that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindFirstArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ModuleFindFirstArgs>(args?: SelectSubset<T, ModuleFindFirstArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Module that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindFirstOrThrowArgs} args - Arguments to find a Module
     * @example
     * // Get one Module
     * const module = await prisma.module.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ModuleFindFirstOrThrowArgs>(args?: SelectSubset<T, ModuleFindFirstOrThrowArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Modules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Modules
     * const modules = await prisma.module.findMany()
     * 
     * // Get first 10 Modules
     * const modules = await prisma.module.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const moduleWithIdOnly = await prisma.module.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ModuleFindManyArgs>(args?: SelectSubset<T, ModuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Module.
     * @param {ModuleCreateArgs} args - Arguments to create a Module.
     * @example
     * // Create one Module
     * const Module = await prisma.module.create({
     *   data: {
     *     // ... data to create a Module
     *   }
     * })
     * 
     */
    create<T extends ModuleCreateArgs>(args: SelectSubset<T, ModuleCreateArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Modules.
     * @param {ModuleCreateManyArgs} args - Arguments to create many Modules.
     * @example
     * // Create many Modules
     * const module = await prisma.module.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ModuleCreateManyArgs>(args?: SelectSubset<T, ModuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Modules and returns the data saved in the database.
     * @param {ModuleCreateManyAndReturnArgs} args - Arguments to create many Modules.
     * @example
     * // Create many Modules
     * const module = await prisma.module.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Modules and only return the `id`
     * const moduleWithIdOnly = await prisma.module.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ModuleCreateManyAndReturnArgs>(args?: SelectSubset<T, ModuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Module.
     * @param {ModuleDeleteArgs} args - Arguments to delete one Module.
     * @example
     * // Delete one Module
     * const Module = await prisma.module.delete({
     *   where: {
     *     // ... filter to delete one Module
     *   }
     * })
     * 
     */
    delete<T extends ModuleDeleteArgs>(args: SelectSubset<T, ModuleDeleteArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Module.
     * @param {ModuleUpdateArgs} args - Arguments to update one Module.
     * @example
     * // Update one Module
     * const module = await prisma.module.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ModuleUpdateArgs>(args: SelectSubset<T, ModuleUpdateArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Modules.
     * @param {ModuleDeleteManyArgs} args - Arguments to filter Modules to delete.
     * @example
     * // Delete a few Modules
     * const { count } = await prisma.module.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ModuleDeleteManyArgs>(args?: SelectSubset<T, ModuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Modules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Modules
     * const module = await prisma.module.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ModuleUpdateManyArgs>(args: SelectSubset<T, ModuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Module.
     * @param {ModuleUpsertArgs} args - Arguments to update or create a Module.
     * @example
     * // Update or create a Module
     * const module = await prisma.module.upsert({
     *   create: {
     *     // ... data to create a Module
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Module we want to update
     *   }
     * })
     */
    upsert<T extends ModuleUpsertArgs>(args: SelectSubset<T, ModuleUpsertArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Modules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleCountArgs} args - Arguments to filter Modules to count.
     * @example
     * // Count the number of Modules
     * const count = await prisma.module.count({
     *   where: {
     *     // ... the filter for the Modules we want to count
     *   }
     * })
    **/
    count<T extends ModuleCountArgs>(
      args?: Subset<T, ModuleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ModuleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Module.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ModuleAggregateArgs>(args: Subset<T, ModuleAggregateArgs>): Prisma.PrismaPromise<GetModuleAggregateType<T>>

    /**
     * Group by Module.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ModuleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ModuleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ModuleGroupByArgs['orderBy'] }
        : { orderBy?: ModuleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ModuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetModuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Module model
   */
  readonly fields: ModuleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Module.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ModuleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    permissions<T extends Module$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, Module$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Module model
   */ 
  interface ModuleFieldRefs {
    readonly id: FieldRef<"Module", 'String'>
    readonly name: FieldRef<"Module", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Module findUnique
   */
  export type ModuleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module findUniqueOrThrow
   */
  export type ModuleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module findFirst
   */
  export type ModuleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Modules.
     */
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module findFirstOrThrow
   */
  export type ModuleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Module to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Modules.
     */
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module findMany
   */
  export type ModuleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter, which Modules to fetch.
     */
    where?: ModuleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Modules to fetch.
     */
    orderBy?: ModuleOrderByWithRelationInput | ModuleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Modules.
     */
    cursor?: ModuleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Modules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Modules.
     */
    skip?: number
    distinct?: ModuleScalarFieldEnum | ModuleScalarFieldEnum[]
  }

  /**
   * Module create
   */
  export type ModuleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The data needed to create a Module.
     */
    data: XOR<ModuleCreateInput, ModuleUncheckedCreateInput>
  }

  /**
   * Module createMany
   */
  export type ModuleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Modules.
     */
    data: ModuleCreateManyInput | ModuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Module createManyAndReturn
   */
  export type ModuleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Modules.
     */
    data: ModuleCreateManyInput | ModuleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Module update
   */
  export type ModuleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The data needed to update a Module.
     */
    data: XOR<ModuleUpdateInput, ModuleUncheckedUpdateInput>
    /**
     * Choose, which Module to update.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module updateMany
   */
  export type ModuleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Modules.
     */
    data: XOR<ModuleUpdateManyMutationInput, ModuleUncheckedUpdateManyInput>
    /**
     * Filter which Modules to update
     */
    where?: ModuleWhereInput
  }

  /**
   * Module upsert
   */
  export type ModuleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * The filter to search for the Module to update in case it exists.
     */
    where: ModuleWhereUniqueInput
    /**
     * In case the Module found by the `where` argument doesn't exist, create a new Module with this data.
     */
    create: XOR<ModuleCreateInput, ModuleUncheckedCreateInput>
    /**
     * In case the Module was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ModuleUpdateInput, ModuleUncheckedUpdateInput>
  }

  /**
   * Module delete
   */
  export type ModuleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
    /**
     * Filter which Module to delete.
     */
    where: ModuleWhereUniqueInput
  }

  /**
   * Module deleteMany
   */
  export type ModuleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Modules to delete
     */
    where?: ModuleWhereInput
  }

  /**
   * Module.permissions
   */
  export type Module$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    cursor?: PermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Module without action
   */
  export type ModuleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Module
     */
    select?: ModuleSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ModuleInclude<ExtArgs> | null
  }


  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  export type PermissionMinAggregateOutputType = {
    id: string | null
    roleId: string | null
    moduleId: string | null
    canView: boolean | null
    canCreate: boolean | null
    canEdit: boolean | null
    canDelete: boolean | null
  }

  export type PermissionMaxAggregateOutputType = {
    id: string | null
    roleId: string | null
    moduleId: string | null
    canView: boolean | null
    canCreate: boolean | null
    canEdit: boolean | null
    canDelete: boolean | null
  }

  export type PermissionCountAggregateOutputType = {
    id: number
    roleId: number
    moduleId: number
    canView: number
    canCreate: number
    canEdit: number
    canDelete: number
    _all: number
  }


  export type PermissionMinAggregateInputType = {
    id?: true
    roleId?: true
    moduleId?: true
    canView?: true
    canCreate?: true
    canEdit?: true
    canDelete?: true
  }

  export type PermissionMaxAggregateInputType = {
    id?: true
    roleId?: true
    moduleId?: true
    canView?: true
    canCreate?: true
    canEdit?: true
    canDelete?: true
  }

  export type PermissionCountAggregateInputType = {
    id?: true
    roleId?: true
    moduleId?: true
    canView?: true
    canCreate?: true
    canEdit?: true
    canDelete?: true
    _all?: true
  }

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Permissions
    **/
    _count?: true | PermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionMaxAggregateInputType
  }

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
        [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>
  }




  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[]
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum
    having?: PermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionCountAggregateInputType | true
    _min?: PermissionMinAggregateInputType
    _max?: PermissionMaxAggregateInputType
  }

  export type PermissionGroupByOutputType = {
    id: string
    roleId: string
    moduleId: string
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    _count: PermissionCountAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
        }
      >
    >


  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    moduleId?: boolean
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    moduleId?: boolean
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectScalar = {
    id?: boolean
    roleId?: boolean
    moduleId?: boolean
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }

  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }
  export type PermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    module?: boolean | ModuleDefaultArgs<ExtArgs>
  }

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Permission"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      module: Prisma.$ModulePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roleId: string
      moduleId: string
      canView: boolean
      canCreate: boolean
      canEdit: boolean
      canDelete: boolean
    }, ExtArgs["result"]["permission"]>
    composites: {}
  }

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<Prisma.$PermissionPayload, S>

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PermissionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PermissionCountAggregateInputType | true
    }

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission'], meta: { name: 'Permission' } }
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionFindUniqueArgs>(args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Permission that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionFindFirstArgs>(args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionWithIdOnly = await prisma.permission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PermissionFindManyArgs>(args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     * 
     */
    create<T extends PermissionCreateArgs>(args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Permissions.
     * @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PermissionCreateManyArgs>(args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {PermissionCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, PermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     * 
     */
    delete<T extends PermissionDeleteArgs>(args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PermissionUpdateArgs>(args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PermissionDeleteManyArgs>(args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PermissionUpdateManyArgs>(args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     */
    upsert<T extends PermissionUpsertArgs>(args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PermissionAggregateArgs>(args: Subset<T, PermissionAggregateArgs>): Prisma.PrismaPromise<GetPermissionAggregateType<T>>

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Permission model
   */
  readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    module<T extends ModuleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ModuleDefaultArgs<ExtArgs>>): Prisma__ModuleClient<$Result.GetResult<Prisma.$ModulePayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Permission model
   */ 
  interface PermissionFieldRefs {
    readonly id: FieldRef<"Permission", 'String'>
    readonly roleId: FieldRef<"Permission", 'String'>
    readonly moduleId: FieldRef<"Permission", 'String'>
    readonly canView: FieldRef<"Permission", 'Boolean'>
    readonly canCreate: FieldRef<"Permission", 'Boolean'>
    readonly canEdit: FieldRef<"Permission", 'Boolean'>
    readonly canDelete: FieldRef<"Permission", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
  }

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission createManyAndReturn
   */
  export type PermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
  }

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
  }

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput
  }

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
  }


  /**
   * Model SystemLog
   */

  export type AggregateSystemLog = {
    _count: SystemLogCountAggregateOutputType | null
    _avg: SystemLogAvgAggregateOutputType | null
    _sum: SystemLogSumAggregateOutputType | null
    _min: SystemLogMinAggregateOutputType | null
    _max: SystemLogMaxAggregateOutputType | null
  }

  export type SystemLogAvgAggregateOutputType = {
    plcAddress: number | null
  }

  export type SystemLogSumAggregateOutputType = {
    plcAddress: number | null
  }

  export type SystemLogMinAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    user: $Enums.LogUser | null
    action: $Enums.LogAction | null
    item: string | null
    details: string | null
    status: $Enums.LogStatus | null
    plcOperation: string | null
    plcAddress: number | null
    plcValue: string | null
    rackId: string | null
    createdAt: Date | null
  }

  export type SystemLogMaxAggregateOutputType = {
    id: string | null
    timestamp: Date | null
    user: $Enums.LogUser | null
    action: $Enums.LogAction | null
    item: string | null
    details: string | null
    status: $Enums.LogStatus | null
    plcOperation: string | null
    plcAddress: number | null
    plcValue: string | null
    rackId: string | null
    createdAt: Date | null
  }

  export type SystemLogCountAggregateOutputType = {
    id: number
    timestamp: number
    user: number
    action: number
    item: number
    details: number
    status: number
    plcOperation: number
    plcAddress: number
    plcValue: number
    rackId: number
    createdAt: number
    _all: number
  }


  export type SystemLogAvgAggregateInputType = {
    plcAddress?: true
  }

  export type SystemLogSumAggregateInputType = {
    plcAddress?: true
  }

  export type SystemLogMinAggregateInputType = {
    id?: true
    timestamp?: true
    user?: true
    action?: true
    item?: true
    details?: true
    status?: true
    plcOperation?: true
    plcAddress?: true
    plcValue?: true
    rackId?: true
    createdAt?: true
  }

  export type SystemLogMaxAggregateInputType = {
    id?: true
    timestamp?: true
    user?: true
    action?: true
    item?: true
    details?: true
    status?: true
    plcOperation?: true
    plcAddress?: true
    plcValue?: true
    rackId?: true
    createdAt?: true
  }

  export type SystemLogCountAggregateInputType = {
    id?: true
    timestamp?: true
    user?: true
    action?: true
    item?: true
    details?: true
    status?: true
    plcOperation?: true
    plcAddress?: true
    plcValue?: true
    rackId?: true
    createdAt?: true
    _all?: true
  }

  export type SystemLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemLog to aggregate.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemLogs
    **/
    _count?: true | SystemLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SystemLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SystemLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemLogMaxAggregateInputType
  }

  export type GetSystemLogAggregateType<T extends SystemLogAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemLog[P]>
      : GetScalarType<T[P], AggregateSystemLog[P]>
  }




  export type SystemLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemLogWhereInput
    orderBy?: SystemLogOrderByWithAggregationInput | SystemLogOrderByWithAggregationInput[]
    by: SystemLogScalarFieldEnum[] | SystemLogScalarFieldEnum
    having?: SystemLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemLogCountAggregateInputType | true
    _avg?: SystemLogAvgAggregateInputType
    _sum?: SystemLogSumAggregateInputType
    _min?: SystemLogMinAggregateInputType
    _max?: SystemLogMaxAggregateInputType
  }

  export type SystemLogGroupByOutputType = {
    id: string
    timestamp: Date
    user: $Enums.LogUser
    action: $Enums.LogAction
    item: string
    details: string
    status: $Enums.LogStatus
    plcOperation: string | null
    plcAddress: number | null
    plcValue: string | null
    rackId: string | null
    createdAt: Date
    _count: SystemLogCountAggregateOutputType | null
    _avg: SystemLogAvgAggregateOutputType | null
    _sum: SystemLogSumAggregateOutputType | null
    _min: SystemLogMinAggregateOutputType | null
    _max: SystemLogMaxAggregateOutputType | null
  }

  type GetSystemLogGroupByPayload<T extends SystemLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemLogGroupByOutputType[P]>
            : GetScalarType<T[P], SystemLogGroupByOutputType[P]>
        }
      >
    >


  export type SystemLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    user?: boolean
    action?: boolean
    item?: boolean
    details?: boolean
    status?: boolean
    plcOperation?: boolean
    plcAddress?: boolean
    plcValue?: boolean
    rackId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["systemLog"]>

  export type SystemLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    timestamp?: boolean
    user?: boolean
    action?: boolean
    item?: boolean
    details?: boolean
    status?: boolean
    plcOperation?: boolean
    plcAddress?: boolean
    plcValue?: boolean
    rackId?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["systemLog"]>

  export type SystemLogSelectScalar = {
    id?: boolean
    timestamp?: boolean
    user?: boolean
    action?: boolean
    item?: boolean
    details?: boolean
    status?: boolean
    plcOperation?: boolean
    plcAddress?: boolean
    plcValue?: boolean
    rackId?: boolean
    createdAt?: boolean
  }


  export type $SystemLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      timestamp: Date
      user: $Enums.LogUser
      action: $Enums.LogAction
      item: string
      details: string
      status: $Enums.LogStatus
      plcOperation: string | null
      plcAddress: number | null
      plcValue: string | null
      rackId: string | null
      createdAt: Date
    }, ExtArgs["result"]["systemLog"]>
    composites: {}
  }

  type SystemLogGetPayload<S extends boolean | null | undefined | SystemLogDefaultArgs> = $Result.GetResult<Prisma.$SystemLogPayload, S>

  type SystemLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SystemLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SystemLogCountAggregateInputType | true
    }

  export interface SystemLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemLog'], meta: { name: 'SystemLog' } }
    /**
     * Find zero or one SystemLog that matches the filter.
     * @param {SystemLogFindUniqueArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemLogFindUniqueArgs>(args: SelectSubset<T, SystemLogFindUniqueArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one SystemLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SystemLogFindUniqueOrThrowArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemLogFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first SystemLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogFindFirstArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemLogFindFirstArgs>(args?: SelectSubset<T, SystemLogFindFirstArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first SystemLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogFindFirstOrThrowArgs} args - Arguments to find a SystemLog
     * @example
     * // Get one SystemLog
     * const systemLog = await prisma.systemLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemLogFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more SystemLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemLogs
     * const systemLogs = await prisma.systemLog.findMany()
     * 
     * // Get first 10 SystemLogs
     * const systemLogs = await prisma.systemLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemLogWithIdOnly = await prisma.systemLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemLogFindManyArgs>(args?: SelectSubset<T, SystemLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a SystemLog.
     * @param {SystemLogCreateArgs} args - Arguments to create a SystemLog.
     * @example
     * // Create one SystemLog
     * const SystemLog = await prisma.systemLog.create({
     *   data: {
     *     // ... data to create a SystemLog
     *   }
     * })
     * 
     */
    create<T extends SystemLogCreateArgs>(args: SelectSubset<T, SystemLogCreateArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many SystemLogs.
     * @param {SystemLogCreateManyArgs} args - Arguments to create many SystemLogs.
     * @example
     * // Create many SystemLogs
     * const systemLog = await prisma.systemLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemLogCreateManyArgs>(args?: SelectSubset<T, SystemLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemLogs and returns the data saved in the database.
     * @param {SystemLogCreateManyAndReturnArgs} args - Arguments to create many SystemLogs.
     * @example
     * // Create many SystemLogs
     * const systemLog = await prisma.systemLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemLogs and only return the `id`
     * const systemLogWithIdOnly = await prisma.systemLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemLogCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a SystemLog.
     * @param {SystemLogDeleteArgs} args - Arguments to delete one SystemLog.
     * @example
     * // Delete one SystemLog
     * const SystemLog = await prisma.systemLog.delete({
     *   where: {
     *     // ... filter to delete one SystemLog
     *   }
     * })
     * 
     */
    delete<T extends SystemLogDeleteArgs>(args: SelectSubset<T, SystemLogDeleteArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one SystemLog.
     * @param {SystemLogUpdateArgs} args - Arguments to update one SystemLog.
     * @example
     * // Update one SystemLog
     * const systemLog = await prisma.systemLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemLogUpdateArgs>(args: SelectSubset<T, SystemLogUpdateArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more SystemLogs.
     * @param {SystemLogDeleteManyArgs} args - Arguments to filter SystemLogs to delete.
     * @example
     * // Delete a few SystemLogs
     * const { count } = await prisma.systemLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemLogDeleteManyArgs>(args?: SelectSubset<T, SystemLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemLogs
     * const systemLog = await prisma.systemLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemLogUpdateManyArgs>(args: SelectSubset<T, SystemLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SystemLog.
     * @param {SystemLogUpsertArgs} args - Arguments to update or create a SystemLog.
     * @example
     * // Update or create a SystemLog
     * const systemLog = await prisma.systemLog.upsert({
     *   create: {
     *     // ... data to create a SystemLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemLog we want to update
     *   }
     * })
     */
    upsert<T extends SystemLogUpsertArgs>(args: SelectSubset<T, SystemLogUpsertArgs<ExtArgs>>): Prisma__SystemLogClient<$Result.GetResult<Prisma.$SystemLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of SystemLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogCountArgs} args - Arguments to filter SystemLogs to count.
     * @example
     * // Count the number of SystemLogs
     * const count = await prisma.systemLog.count({
     *   where: {
     *     // ... the filter for the SystemLogs we want to count
     *   }
     * })
    **/
    count<T extends SystemLogCountArgs>(
      args?: Subset<T, SystemLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemLogAggregateArgs>(args: Subset<T, SystemLogAggregateArgs>): Prisma.PrismaPromise<GetSystemLogAggregateType<T>>

    /**
     * Group by SystemLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemLogGroupByArgs['orderBy'] }
        : { orderBy?: SystemLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemLog model
   */
  readonly fields: SystemLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemLog model
   */ 
  interface SystemLogFieldRefs {
    readonly id: FieldRef<"SystemLog", 'String'>
    readonly timestamp: FieldRef<"SystemLog", 'DateTime'>
    readonly user: FieldRef<"SystemLog", 'LogUser'>
    readonly action: FieldRef<"SystemLog", 'LogAction'>
    readonly item: FieldRef<"SystemLog", 'String'>
    readonly details: FieldRef<"SystemLog", 'String'>
    readonly status: FieldRef<"SystemLog", 'LogStatus'>
    readonly plcOperation: FieldRef<"SystemLog", 'String'>
    readonly plcAddress: FieldRef<"SystemLog", 'Int'>
    readonly plcValue: FieldRef<"SystemLog", 'String'>
    readonly rackId: FieldRef<"SystemLog", 'String'>
    readonly createdAt: FieldRef<"SystemLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemLog findUnique
   */
  export type SystemLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog findUniqueOrThrow
   */
  export type SystemLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog findFirst
   */
  export type SystemLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemLogs.
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemLogs.
     */
    distinct?: SystemLogScalarFieldEnum | SystemLogScalarFieldEnum[]
  }

  /**
   * SystemLog findFirstOrThrow
   */
  export type SystemLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLog to fetch.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemLogs.
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemLogs.
     */
    distinct?: SystemLogScalarFieldEnum | SystemLogScalarFieldEnum[]
  }

  /**
   * SystemLog findMany
   */
  export type SystemLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter, which SystemLogs to fetch.
     */
    where?: SystemLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemLogs to fetch.
     */
    orderBy?: SystemLogOrderByWithRelationInput | SystemLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemLogs.
     */
    cursor?: SystemLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemLogs.
     */
    skip?: number
    distinct?: SystemLogScalarFieldEnum | SystemLogScalarFieldEnum[]
  }

  /**
   * SystemLog create
   */
  export type SystemLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * The data needed to create a SystemLog.
     */
    data: XOR<SystemLogCreateInput, SystemLogUncheckedCreateInput>
  }

  /**
   * SystemLog createMany
   */
  export type SystemLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemLogs.
     */
    data: SystemLogCreateManyInput | SystemLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemLog createManyAndReturn
   */
  export type SystemLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SystemLogs.
     */
    data: SystemLogCreateManyInput | SystemLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SystemLog update
   */
  export type SystemLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * The data needed to update a SystemLog.
     */
    data: XOR<SystemLogUpdateInput, SystemLogUncheckedUpdateInput>
    /**
     * Choose, which SystemLog to update.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog updateMany
   */
  export type SystemLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemLogs.
     */
    data: XOR<SystemLogUpdateManyMutationInput, SystemLogUncheckedUpdateManyInput>
    /**
     * Filter which SystemLogs to update
     */
    where?: SystemLogWhereInput
  }

  /**
   * SystemLog upsert
   */
  export type SystemLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * The filter to search for the SystemLog to update in case it exists.
     */
    where: SystemLogWhereUniqueInput
    /**
     * In case the SystemLog found by the `where` argument doesn't exist, create a new SystemLog with this data.
     */
    create: XOR<SystemLogCreateInput, SystemLogUncheckedCreateInput>
    /**
     * In case the SystemLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemLogUpdateInput, SystemLogUncheckedUpdateInput>
  }

  /**
   * SystemLog delete
   */
  export type SystemLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
    /**
     * Filter which SystemLog to delete.
     */
    where: SystemLogWhereUniqueInput
  }

  /**
   * SystemLog deleteMany
   */
  export type SystemLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemLogs to delete
     */
    where?: SystemLogWhereInput
  }

  /**
   * SystemLog without action
   */
  export type SystemLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemLog
     */
    select?: SystemLogSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    roleId: 'roleId',
    createdAt: 'createdAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const CategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type CategoryScalarFieldEnum = (typeof CategoryScalarFieldEnum)[keyof typeof CategoryScalarFieldEnum]


  export const SubCategoryScalarFieldEnum: {
    id: 'id',
    name: 'name',
    isActive: 'isActive',
    categoryId: 'categoryId',
    createdAt: 'createdAt'
  };

  export type SubCategoryScalarFieldEnum = (typeof SubCategoryScalarFieldEnum)[keyof typeof SubCategoryScalarFieldEnum]


  export const SKUScalarFieldEnum: {
    id: 'id',
    skuCode: 'skuCode',
    productName: 'productName',
    categoryId: 'categoryId',
    subCategoryId: 'subCategoryId',
    length: 'length',
    width: 'width',
    height: 'height',
    weight: 'weight',
    barcode: 'barcode',
    barcodeFormat: 'barcodeFormat',
    stock: 'stock',
    rackLocation: 'rackLocation',
    createdAt: 'createdAt'
  };

  export type SKUScalarFieldEnum = (typeof SKUScalarFieldEnum)[keyof typeof SKUScalarFieldEnum]


  export const RackScalarFieldEnum: {
    id: 'id',
    name: 'name',
    room: 'room'
  };

  export type RackScalarFieldEnum = (typeof RackScalarFieldEnum)[keyof typeof RackScalarFieldEnum]


  export const ShelfScalarFieldEnum: {
    id: 'id',
    rackId: 'rackId',
    level: 'level',
    maxVolume: 'maxVolume',
    maxWeight: 'maxWeight',
    usedVolume: 'usedVolume',
    usedWeight: 'usedWeight'
  };

  export type ShelfScalarFieldEnum = (typeof ShelfScalarFieldEnum)[keyof typeof ShelfScalarFieldEnum]


  export const InventoryScalarFieldEnum: {
    id: 'id',
    skuId: 'skuId',
    shelfId: 'shelfId',
    quantity: 'quantity',
    qrCode: 'qrCode'
  };

  export type InventoryScalarFieldEnum = (typeof InventoryScalarFieldEnum)[keyof typeof InventoryScalarFieldEnum]


  export const TransactionScalarFieldEnum: {
    id: 'id',
    type: 'type',
    skuId: 'skuId',
    quantity: 'quantity',
    rackLocation: 'rackLocation',
    status: 'status',
    timestamp: 'timestamp',
    userId: 'userId',
    barcodeValue: 'barcodeValue',
    barcodeNumber: 'barcodeNumber',
    barcodeImageData: 'barcodeImageData'
  };

  export type TransactionScalarFieldEnum = (typeof TransactionScalarFieldEnum)[keyof typeof TransactionScalarFieldEnum]


  export const BillingScalarFieldEnum: {
    id: 'id',
    invoiceId: 'invoiceId',
    orderId: 'orderId',
    skuId: 'skuId',
    productName: 'productName',
    rackHistory: 'rackHistory',
    duration: 'duration',
    weightCharges: 'weightCharges',
    rackCharges: 'rackCharges',
    amount: 'amount',
    status: 'status',
    date: 'date',
    gstPercent: 'gstPercent',
    companyName: 'companyName',
    companyGst: 'companyGst',
    companyAddr: 'companyAddr',
    companyEmail: 'companyEmail',
    companyPhone: 'companyPhone',
    customerName: 'customerName',
    customerGst: 'customerGst',
    customerAddr: 'customerAddr',
    customerEmail: 'customerEmail',
    customerPhone: 'customerPhone',
    customerId: 'customerId'
  };

  export type BillingScalarFieldEnum = (typeof BillingScalarFieldEnum)[keyof typeof BillingScalarFieldEnum]


  export const CustomerScalarFieldEnum: {
    id: 'id',
    name: 'name',
    gstNumber: 'gstNumber',
    address: 'address',
    email: 'email',
    phone: 'phone',
    createdAt: 'createdAt'
  };

  export type CustomerScalarFieldEnum = (typeof CustomerScalarFieldEnum)[keyof typeof CustomerScalarFieldEnum]


  export const CompanySettingScalarFieldEnum: {
    id: 'id',
    name: 'name',
    gstin: 'gstin',
    address: 'address',
    email: 'email',
    phone: 'phone',
    createdAt: 'createdAt'
  };

  export type CompanySettingScalarFieldEnum = (typeof CompanySettingScalarFieldEnum)[keyof typeof CompanySettingScalarFieldEnum]


  export const ModuleScalarFieldEnum: {
    id: 'id',
    name: 'name'
  };

  export type ModuleScalarFieldEnum = (typeof ModuleScalarFieldEnum)[keyof typeof ModuleScalarFieldEnum]


  export const PermissionScalarFieldEnum: {
    id: 'id',
    roleId: 'roleId',
    moduleId: 'moduleId',
    canView: 'canView',
    canCreate: 'canCreate',
    canEdit: 'canEdit',
    canDelete: 'canDelete'
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


  export const SystemLogScalarFieldEnum: {
    id: 'id',
    timestamp: 'timestamp',
    user: 'user',
    action: 'action',
    item: 'item',
    details: 'details',
    status: 'status',
    plcOperation: 'plcOperation',
    plcAddress: 'plcAddress',
    plcValue: 'plcValue',
    rackId: 'rackId',
    createdAt: 'createdAt'
  };

  export type SystemLogScalarFieldEnum = (typeof SystemLogScalarFieldEnum)[keyof typeof SystemLogScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Room'
   */
  export type EnumRoomFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Room'>
    


  /**
   * Reference to a field of type 'Room[]'
   */
  export type ListEnumRoomFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Room[]'>
    


  /**
   * Reference to a field of type 'Level'
   */
  export type EnumLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Level'>
    


  /**
   * Reference to a field of type 'Level[]'
   */
  export type ListEnumLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Level[]'>
    


  /**
   * Reference to a field of type 'TxType'
   */
  export type EnumTxTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TxType'>
    


  /**
   * Reference to a field of type 'TxType[]'
   */
  export type ListEnumTxTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TxType[]'>
    


  /**
   * Reference to a field of type 'LogUser'
   */
  export type EnumLogUserFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogUser'>
    


  /**
   * Reference to a field of type 'LogUser[]'
   */
  export type ListEnumLogUserFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogUser[]'>
    


  /**
   * Reference to a field of type 'LogAction'
   */
  export type EnumLogActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogAction'>
    


  /**
   * Reference to a field of type 'LogAction[]'
   */
  export type ListEnumLogActionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogAction[]'>
    


  /**
   * Reference to a field of type 'LogStatus'
   */
  export type EnumLogStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogStatus'>
    


  /**
   * Reference to a field of type 'LogStatus[]'
   */
  export type ListEnumLogStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LogStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    roleId?: UuidFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    role?: XOR<RoleRelationFilter, RoleWhereInput>
    transactions?: TransactionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
    role?: RoleOrderByWithRelationInput
    transactions?: TransactionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    roleId?: UuidFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
    role?: XOR<RoleRelationFilter, RoleWhereInput>
    transactions?: TransactionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    roleId?: UuidWithAggregatesFilter<"User"> | string
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: UuidFilter<"Role"> | string
    name?: StringFilter<"Role"> | string
    users?: UserListRelationFilter
    permissions?: PermissionListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    users?: UserOrderByRelationAggregateInput
    permissions?: PermissionOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    users?: UserListRelationFilter
    permissions?: PermissionListRelationFilter
  }, "id" | "name">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Role"> | string
    name?: StringWithAggregatesFilter<"Role"> | string
  }

  export type CategoryWhereInput = {
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    id?: UuidFilter<"Category"> | string
    name?: StringFilter<"Category"> | string
    isActive?: BoolFilter<"Category"> | boolean
    createdAt?: DateTimeFilter<"Category"> | Date | string
    subcategories?: SubCategoryListRelationFilter
    skus?: SKUListRelationFilter
  }

  export type CategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    subcategories?: SubCategoryOrderByRelationAggregateInput
    skus?: SKUOrderByRelationAggregateInput
  }

  export type CategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CategoryWhereInput | CategoryWhereInput[]
    OR?: CategoryWhereInput[]
    NOT?: CategoryWhereInput | CategoryWhereInput[]
    isActive?: BoolFilter<"Category"> | boolean
    createdAt?: DateTimeFilter<"Category"> | Date | string
    subcategories?: SubCategoryListRelationFilter
    skus?: SKUListRelationFilter
  }, "id" | "name">

  export type CategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: CategoryCountOrderByAggregateInput
    _max?: CategoryMaxOrderByAggregateInput
    _min?: CategoryMinOrderByAggregateInput
  }

  export type CategoryScalarWhereWithAggregatesInput = {
    AND?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    OR?: CategoryScalarWhereWithAggregatesInput[]
    NOT?: CategoryScalarWhereWithAggregatesInput | CategoryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Category"> | string
    name?: StringWithAggregatesFilter<"Category"> | string
    isActive?: BoolWithAggregatesFilter<"Category"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Category"> | Date | string
  }

  export type SubCategoryWhereInput = {
    AND?: SubCategoryWhereInput | SubCategoryWhereInput[]
    OR?: SubCategoryWhereInput[]
    NOT?: SubCategoryWhereInput | SubCategoryWhereInput[]
    id?: UuidFilter<"SubCategory"> | string
    name?: StringFilter<"SubCategory"> | string
    isActive?: BoolFilter<"SubCategory"> | boolean
    categoryId?: UuidFilter<"SubCategory"> | string
    createdAt?: DateTimeFilter<"SubCategory"> | Date | string
    category?: XOR<CategoryRelationFilter, CategoryWhereInput>
    skus?: SKUListRelationFilter
  }

  export type SubCategoryOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
    skus?: SKUOrderByRelationAggregateInput
  }

  export type SubCategoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SubCategoryWhereInput | SubCategoryWhereInput[]
    OR?: SubCategoryWhereInput[]
    NOT?: SubCategoryWhereInput | SubCategoryWhereInput[]
    name?: StringFilter<"SubCategory"> | string
    isActive?: BoolFilter<"SubCategory"> | boolean
    categoryId?: UuidFilter<"SubCategory"> | string
    createdAt?: DateTimeFilter<"SubCategory"> | Date | string
    category?: XOR<CategoryRelationFilter, CategoryWhereInput>
    skus?: SKUListRelationFilter
  }, "id">

  export type SubCategoryOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
    _count?: SubCategoryCountOrderByAggregateInput
    _max?: SubCategoryMaxOrderByAggregateInput
    _min?: SubCategoryMinOrderByAggregateInput
  }

  export type SubCategoryScalarWhereWithAggregatesInput = {
    AND?: SubCategoryScalarWhereWithAggregatesInput | SubCategoryScalarWhereWithAggregatesInput[]
    OR?: SubCategoryScalarWhereWithAggregatesInput[]
    NOT?: SubCategoryScalarWhereWithAggregatesInput | SubCategoryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SubCategory"> | string
    name?: StringWithAggregatesFilter<"SubCategory"> | string
    isActive?: BoolWithAggregatesFilter<"SubCategory"> | boolean
    categoryId?: UuidWithAggregatesFilter<"SubCategory"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SubCategory"> | Date | string
  }

  export type SKUWhereInput = {
    AND?: SKUWhereInput | SKUWhereInput[]
    OR?: SKUWhereInput[]
    NOT?: SKUWhereInput | SKUWhereInput[]
    id?: UuidFilter<"SKU"> | string
    skuCode?: StringFilter<"SKU"> | string
    productName?: StringFilter<"SKU"> | string
    categoryId?: UuidFilter<"SKU"> | string
    subCategoryId?: UuidFilter<"SKU"> | string
    length?: FloatFilter<"SKU"> | number
    width?: FloatFilter<"SKU"> | number
    height?: FloatFilter<"SKU"> | number
    weight?: FloatFilter<"SKU"> | number
    barcode?: StringNullableFilter<"SKU"> | string | null
    barcodeFormat?: StringFilter<"SKU"> | string
    stock?: IntFilter<"SKU"> | number
    rackLocation?: StringNullableFilter<"SKU"> | string | null
    createdAt?: DateTimeFilter<"SKU"> | Date | string
    category?: XOR<CategoryRelationFilter, CategoryWhereInput>
    subCategory?: XOR<SubCategoryRelationFilter, SubCategoryWhereInput>
    inventories?: InventoryListRelationFilter
    transactions?: TransactionListRelationFilter
    billings?: BillingListRelationFilter
  }

  export type SKUOrderByWithRelationInput = {
    id?: SortOrder
    skuCode?: SortOrder
    productName?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    length?: SortOrder
    width?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    barcode?: SortOrderInput | SortOrder
    barcodeFormat?: SortOrder
    stock?: SortOrder
    rackLocation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    category?: CategoryOrderByWithRelationInput
    subCategory?: SubCategoryOrderByWithRelationInput
    inventories?: InventoryOrderByRelationAggregateInput
    transactions?: TransactionOrderByRelationAggregateInput
    billings?: BillingOrderByRelationAggregateInput
  }

  export type SKUWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    skuCode?: string
    barcode?: string
    AND?: SKUWhereInput | SKUWhereInput[]
    OR?: SKUWhereInput[]
    NOT?: SKUWhereInput | SKUWhereInput[]
    productName?: StringFilter<"SKU"> | string
    categoryId?: UuidFilter<"SKU"> | string
    subCategoryId?: UuidFilter<"SKU"> | string
    length?: FloatFilter<"SKU"> | number
    width?: FloatFilter<"SKU"> | number
    height?: FloatFilter<"SKU"> | number
    weight?: FloatFilter<"SKU"> | number
    barcodeFormat?: StringFilter<"SKU"> | string
    stock?: IntFilter<"SKU"> | number
    rackLocation?: StringNullableFilter<"SKU"> | string | null
    createdAt?: DateTimeFilter<"SKU"> | Date | string
    category?: XOR<CategoryRelationFilter, CategoryWhereInput>
    subCategory?: XOR<SubCategoryRelationFilter, SubCategoryWhereInput>
    inventories?: InventoryListRelationFilter
    transactions?: TransactionListRelationFilter
    billings?: BillingListRelationFilter
  }, "id" | "skuCode" | "barcode">

  export type SKUOrderByWithAggregationInput = {
    id?: SortOrder
    skuCode?: SortOrder
    productName?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    length?: SortOrder
    width?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    barcode?: SortOrderInput | SortOrder
    barcodeFormat?: SortOrder
    stock?: SortOrder
    rackLocation?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SKUCountOrderByAggregateInput
    _avg?: SKUAvgOrderByAggregateInput
    _max?: SKUMaxOrderByAggregateInput
    _min?: SKUMinOrderByAggregateInput
    _sum?: SKUSumOrderByAggregateInput
  }

  export type SKUScalarWhereWithAggregatesInput = {
    AND?: SKUScalarWhereWithAggregatesInput | SKUScalarWhereWithAggregatesInput[]
    OR?: SKUScalarWhereWithAggregatesInput[]
    NOT?: SKUScalarWhereWithAggregatesInput | SKUScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SKU"> | string
    skuCode?: StringWithAggregatesFilter<"SKU"> | string
    productName?: StringWithAggregatesFilter<"SKU"> | string
    categoryId?: UuidWithAggregatesFilter<"SKU"> | string
    subCategoryId?: UuidWithAggregatesFilter<"SKU"> | string
    length?: FloatWithAggregatesFilter<"SKU"> | number
    width?: FloatWithAggregatesFilter<"SKU"> | number
    height?: FloatWithAggregatesFilter<"SKU"> | number
    weight?: FloatWithAggregatesFilter<"SKU"> | number
    barcode?: StringNullableWithAggregatesFilter<"SKU"> | string | null
    barcodeFormat?: StringWithAggregatesFilter<"SKU"> | string
    stock?: IntWithAggregatesFilter<"SKU"> | number
    rackLocation?: StringNullableWithAggregatesFilter<"SKU"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SKU"> | Date | string
  }

  export type RackWhereInput = {
    AND?: RackWhereInput | RackWhereInput[]
    OR?: RackWhereInput[]
    NOT?: RackWhereInput | RackWhereInput[]
    id?: UuidFilter<"Rack"> | string
    name?: StringFilter<"Rack"> | string
    room?: EnumRoomFilter<"Rack"> | $Enums.Room
    shelves?: ShelfListRelationFilter
  }

  export type RackOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    room?: SortOrder
    shelves?: ShelfOrderByRelationAggregateInput
  }

  export type RackWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: RackWhereInput | RackWhereInput[]
    OR?: RackWhereInput[]
    NOT?: RackWhereInput | RackWhereInput[]
    room?: EnumRoomFilter<"Rack"> | $Enums.Room
    shelves?: ShelfListRelationFilter
  }, "id" | "name">

  export type RackOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    room?: SortOrder
    _count?: RackCountOrderByAggregateInput
    _max?: RackMaxOrderByAggregateInput
    _min?: RackMinOrderByAggregateInput
  }

  export type RackScalarWhereWithAggregatesInput = {
    AND?: RackScalarWhereWithAggregatesInput | RackScalarWhereWithAggregatesInput[]
    OR?: RackScalarWhereWithAggregatesInput[]
    NOT?: RackScalarWhereWithAggregatesInput | RackScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Rack"> | string
    name?: StringWithAggregatesFilter<"Rack"> | string
    room?: EnumRoomWithAggregatesFilter<"Rack"> | $Enums.Room
  }

  export type ShelfWhereInput = {
    AND?: ShelfWhereInput | ShelfWhereInput[]
    OR?: ShelfWhereInput[]
    NOT?: ShelfWhereInput | ShelfWhereInput[]
    id?: UuidFilter<"Shelf"> | string
    rackId?: UuidFilter<"Shelf"> | string
    level?: EnumLevelFilter<"Shelf"> | $Enums.Level
    maxVolume?: FloatFilter<"Shelf"> | number
    maxWeight?: FloatFilter<"Shelf"> | number
    usedVolume?: FloatFilter<"Shelf"> | number
    usedWeight?: FloatFilter<"Shelf"> | number
    rack?: XOR<RackRelationFilter, RackWhereInput>
    inventories?: InventoryListRelationFilter
  }

  export type ShelfOrderByWithRelationInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    maxVolume?: SortOrder
    maxWeight?: SortOrder
    usedVolume?: SortOrder
    usedWeight?: SortOrder
    rack?: RackOrderByWithRelationInput
    inventories?: InventoryOrderByRelationAggregateInput
  }

  export type ShelfWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ShelfWhereInput | ShelfWhereInput[]
    OR?: ShelfWhereInput[]
    NOT?: ShelfWhereInput | ShelfWhereInput[]
    rackId?: UuidFilter<"Shelf"> | string
    level?: EnumLevelFilter<"Shelf"> | $Enums.Level
    maxVolume?: FloatFilter<"Shelf"> | number
    maxWeight?: FloatFilter<"Shelf"> | number
    usedVolume?: FloatFilter<"Shelf"> | number
    usedWeight?: FloatFilter<"Shelf"> | number
    rack?: XOR<RackRelationFilter, RackWhereInput>
    inventories?: InventoryListRelationFilter
  }, "id">

  export type ShelfOrderByWithAggregationInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    maxVolume?: SortOrder
    maxWeight?: SortOrder
    usedVolume?: SortOrder
    usedWeight?: SortOrder
    _count?: ShelfCountOrderByAggregateInput
    _avg?: ShelfAvgOrderByAggregateInput
    _max?: ShelfMaxOrderByAggregateInput
    _min?: ShelfMinOrderByAggregateInput
    _sum?: ShelfSumOrderByAggregateInput
  }

  export type ShelfScalarWhereWithAggregatesInput = {
    AND?: ShelfScalarWhereWithAggregatesInput | ShelfScalarWhereWithAggregatesInput[]
    OR?: ShelfScalarWhereWithAggregatesInput[]
    NOT?: ShelfScalarWhereWithAggregatesInput | ShelfScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Shelf"> | string
    rackId?: UuidWithAggregatesFilter<"Shelf"> | string
    level?: EnumLevelWithAggregatesFilter<"Shelf"> | $Enums.Level
    maxVolume?: FloatWithAggregatesFilter<"Shelf"> | number
    maxWeight?: FloatWithAggregatesFilter<"Shelf"> | number
    usedVolume?: FloatWithAggregatesFilter<"Shelf"> | number
    usedWeight?: FloatWithAggregatesFilter<"Shelf"> | number
  }

  export type InventoryWhereInput = {
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    id?: UuidFilter<"Inventory"> | string
    skuId?: UuidFilter<"Inventory"> | string
    shelfId?: UuidFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    qrCode?: StringNullableFilter<"Inventory"> | string | null
    sku?: XOR<SKURelationFilter, SKUWhereInput>
    shelf?: XOR<ShelfRelationFilter, ShelfWhereInput>
  }

  export type InventoryOrderByWithRelationInput = {
    id?: SortOrder
    skuId?: SortOrder
    shelfId?: SortOrder
    quantity?: SortOrder
    qrCode?: SortOrderInput | SortOrder
    sku?: SKUOrderByWithRelationInput
    shelf?: ShelfOrderByWithRelationInput
  }

  export type InventoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    qrCode?: string
    AND?: InventoryWhereInput | InventoryWhereInput[]
    OR?: InventoryWhereInput[]
    NOT?: InventoryWhereInput | InventoryWhereInput[]
    skuId?: UuidFilter<"Inventory"> | string
    shelfId?: UuidFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    sku?: XOR<SKURelationFilter, SKUWhereInput>
    shelf?: XOR<ShelfRelationFilter, ShelfWhereInput>
  }, "id" | "qrCode">

  export type InventoryOrderByWithAggregationInput = {
    id?: SortOrder
    skuId?: SortOrder
    shelfId?: SortOrder
    quantity?: SortOrder
    qrCode?: SortOrderInput | SortOrder
    _count?: InventoryCountOrderByAggregateInput
    _avg?: InventoryAvgOrderByAggregateInput
    _max?: InventoryMaxOrderByAggregateInput
    _min?: InventoryMinOrderByAggregateInput
    _sum?: InventorySumOrderByAggregateInput
  }

  export type InventoryScalarWhereWithAggregatesInput = {
    AND?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    OR?: InventoryScalarWhereWithAggregatesInput[]
    NOT?: InventoryScalarWhereWithAggregatesInput | InventoryScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Inventory"> | string
    skuId?: UuidWithAggregatesFilter<"Inventory"> | string
    shelfId?: UuidWithAggregatesFilter<"Inventory"> | string
    quantity?: IntWithAggregatesFilter<"Inventory"> | number
    qrCode?: StringNullableWithAggregatesFilter<"Inventory"> | string | null
  }

  export type TransactionWhereInput = {
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    id?: UuidFilter<"Transaction"> | string
    type?: EnumTxTypeFilter<"Transaction"> | $Enums.TxType
    skuId?: UuidFilter<"Transaction"> | string
    quantity?: IntFilter<"Transaction"> | number
    rackLocation?: StringNullableFilter<"Transaction"> | string | null
    status?: StringFilter<"Transaction"> | string
    timestamp?: DateTimeFilter<"Transaction"> | Date | string
    userId?: UuidNullableFilter<"Transaction"> | string | null
    barcodeValue?: StringNullableFilter<"Transaction"> | string | null
    barcodeNumber?: StringNullableFilter<"Transaction"> | string | null
    barcodeImageData?: StringNullableFilter<"Transaction"> | string | null
    sku?: XOR<SKURelationFilter, SKUWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }

  export type TransactionOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    skuId?: SortOrder
    quantity?: SortOrder
    rackLocation?: SortOrderInput | SortOrder
    status?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrderInput | SortOrder
    barcodeValue?: SortOrderInput | SortOrder
    barcodeNumber?: SortOrderInput | SortOrder
    barcodeImageData?: SortOrderInput | SortOrder
    sku?: SKUOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type TransactionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    barcodeNumber?: string
    AND?: TransactionWhereInput | TransactionWhereInput[]
    OR?: TransactionWhereInput[]
    NOT?: TransactionWhereInput | TransactionWhereInput[]
    type?: EnumTxTypeFilter<"Transaction"> | $Enums.TxType
    skuId?: UuidFilter<"Transaction"> | string
    quantity?: IntFilter<"Transaction"> | number
    rackLocation?: StringNullableFilter<"Transaction"> | string | null
    status?: StringFilter<"Transaction"> | string
    timestamp?: DateTimeFilter<"Transaction"> | Date | string
    userId?: UuidNullableFilter<"Transaction"> | string | null
    barcodeValue?: StringNullableFilter<"Transaction"> | string | null
    barcodeImageData?: StringNullableFilter<"Transaction"> | string | null
    sku?: XOR<SKURelationFilter, SKUWhereInput>
    user?: XOR<UserNullableRelationFilter, UserWhereInput> | null
  }, "id" | "barcodeNumber">

  export type TransactionOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    skuId?: SortOrder
    quantity?: SortOrder
    rackLocation?: SortOrderInput | SortOrder
    status?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrderInput | SortOrder
    barcodeValue?: SortOrderInput | SortOrder
    barcodeNumber?: SortOrderInput | SortOrder
    barcodeImageData?: SortOrderInput | SortOrder
    _count?: TransactionCountOrderByAggregateInput
    _avg?: TransactionAvgOrderByAggregateInput
    _max?: TransactionMaxOrderByAggregateInput
    _min?: TransactionMinOrderByAggregateInput
    _sum?: TransactionSumOrderByAggregateInput
  }

  export type TransactionScalarWhereWithAggregatesInput = {
    AND?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    OR?: TransactionScalarWhereWithAggregatesInput[]
    NOT?: TransactionScalarWhereWithAggregatesInput | TransactionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Transaction"> | string
    type?: EnumTxTypeWithAggregatesFilter<"Transaction"> | $Enums.TxType
    skuId?: UuidWithAggregatesFilter<"Transaction"> | string
    quantity?: IntWithAggregatesFilter<"Transaction"> | number
    rackLocation?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    status?: StringWithAggregatesFilter<"Transaction"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Transaction"> | Date | string
    userId?: UuidNullableWithAggregatesFilter<"Transaction"> | string | null
    barcodeValue?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    barcodeNumber?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
    barcodeImageData?: StringNullableWithAggregatesFilter<"Transaction"> | string | null
  }

  export type BillingWhereInput = {
    AND?: BillingWhereInput | BillingWhereInput[]
    OR?: BillingWhereInput[]
    NOT?: BillingWhereInput | BillingWhereInput[]
    id?: UuidFilter<"Billing"> | string
    invoiceId?: StringFilter<"Billing"> | string
    orderId?: StringFilter<"Billing"> | string
    skuId?: UuidFilter<"Billing"> | string
    productName?: StringFilter<"Billing"> | string
    rackHistory?: StringFilter<"Billing"> | string
    duration?: IntFilter<"Billing"> | number
    weightCharges?: FloatFilter<"Billing"> | number
    rackCharges?: FloatFilter<"Billing"> | number
    amount?: FloatFilter<"Billing"> | number
    status?: StringFilter<"Billing"> | string
    date?: StringFilter<"Billing"> | string
    gstPercent?: FloatNullableFilter<"Billing"> | number | null
    companyName?: StringNullableFilter<"Billing"> | string | null
    companyGst?: StringNullableFilter<"Billing"> | string | null
    companyAddr?: StringNullableFilter<"Billing"> | string | null
    companyEmail?: StringNullableFilter<"Billing"> | string | null
    companyPhone?: StringNullableFilter<"Billing"> | string | null
    customerName?: StringNullableFilter<"Billing"> | string | null
    customerGst?: StringNullableFilter<"Billing"> | string | null
    customerAddr?: StringNullableFilter<"Billing"> | string | null
    customerEmail?: StringNullableFilter<"Billing"> | string | null
    customerPhone?: StringNullableFilter<"Billing"> | string | null
    customerId?: UuidNullableFilter<"Billing"> | string | null
    sku?: XOR<SKURelationFilter, SKUWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
  }

  export type BillingOrderByWithRelationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    orderId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    rackHistory?: SortOrder
    duration?: SortOrder
    weightCharges?: SortOrder
    rackCharges?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    gstPercent?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    companyGst?: SortOrderInput | SortOrder
    companyAddr?: SortOrderInput | SortOrder
    companyEmail?: SortOrderInput | SortOrder
    companyPhone?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    customerGst?: SortOrderInput | SortOrder
    customerAddr?: SortOrderInput | SortOrder
    customerEmail?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    sku?: SKUOrderByWithRelationInput
    customer?: CustomerOrderByWithRelationInput
  }

  export type BillingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    invoiceId?: string
    AND?: BillingWhereInput | BillingWhereInput[]
    OR?: BillingWhereInput[]
    NOT?: BillingWhereInput | BillingWhereInput[]
    orderId?: StringFilter<"Billing"> | string
    skuId?: UuidFilter<"Billing"> | string
    productName?: StringFilter<"Billing"> | string
    rackHistory?: StringFilter<"Billing"> | string
    duration?: IntFilter<"Billing"> | number
    weightCharges?: FloatFilter<"Billing"> | number
    rackCharges?: FloatFilter<"Billing"> | number
    amount?: FloatFilter<"Billing"> | number
    status?: StringFilter<"Billing"> | string
    date?: StringFilter<"Billing"> | string
    gstPercent?: FloatNullableFilter<"Billing"> | number | null
    companyName?: StringNullableFilter<"Billing"> | string | null
    companyGst?: StringNullableFilter<"Billing"> | string | null
    companyAddr?: StringNullableFilter<"Billing"> | string | null
    companyEmail?: StringNullableFilter<"Billing"> | string | null
    companyPhone?: StringNullableFilter<"Billing"> | string | null
    customerName?: StringNullableFilter<"Billing"> | string | null
    customerGst?: StringNullableFilter<"Billing"> | string | null
    customerAddr?: StringNullableFilter<"Billing"> | string | null
    customerEmail?: StringNullableFilter<"Billing"> | string | null
    customerPhone?: StringNullableFilter<"Billing"> | string | null
    customerId?: UuidNullableFilter<"Billing"> | string | null
    sku?: XOR<SKURelationFilter, SKUWhereInput>
    customer?: XOR<CustomerNullableRelationFilter, CustomerWhereInput> | null
  }, "id" | "invoiceId">

  export type BillingOrderByWithAggregationInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    orderId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    rackHistory?: SortOrder
    duration?: SortOrder
    weightCharges?: SortOrder
    rackCharges?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    gstPercent?: SortOrderInput | SortOrder
    companyName?: SortOrderInput | SortOrder
    companyGst?: SortOrderInput | SortOrder
    companyAddr?: SortOrderInput | SortOrder
    companyEmail?: SortOrderInput | SortOrder
    companyPhone?: SortOrderInput | SortOrder
    customerName?: SortOrderInput | SortOrder
    customerGst?: SortOrderInput | SortOrder
    customerAddr?: SortOrderInput | SortOrder
    customerEmail?: SortOrderInput | SortOrder
    customerPhone?: SortOrderInput | SortOrder
    customerId?: SortOrderInput | SortOrder
    _count?: BillingCountOrderByAggregateInput
    _avg?: BillingAvgOrderByAggregateInput
    _max?: BillingMaxOrderByAggregateInput
    _min?: BillingMinOrderByAggregateInput
    _sum?: BillingSumOrderByAggregateInput
  }

  export type BillingScalarWhereWithAggregatesInput = {
    AND?: BillingScalarWhereWithAggregatesInput | BillingScalarWhereWithAggregatesInput[]
    OR?: BillingScalarWhereWithAggregatesInput[]
    NOT?: BillingScalarWhereWithAggregatesInput | BillingScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Billing"> | string
    invoiceId?: StringWithAggregatesFilter<"Billing"> | string
    orderId?: StringWithAggregatesFilter<"Billing"> | string
    skuId?: UuidWithAggregatesFilter<"Billing"> | string
    productName?: StringWithAggregatesFilter<"Billing"> | string
    rackHistory?: StringWithAggregatesFilter<"Billing"> | string
    duration?: IntWithAggregatesFilter<"Billing"> | number
    weightCharges?: FloatWithAggregatesFilter<"Billing"> | number
    rackCharges?: FloatWithAggregatesFilter<"Billing"> | number
    amount?: FloatWithAggregatesFilter<"Billing"> | number
    status?: StringWithAggregatesFilter<"Billing"> | string
    date?: StringWithAggregatesFilter<"Billing"> | string
    gstPercent?: FloatNullableWithAggregatesFilter<"Billing"> | number | null
    companyName?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    companyGst?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    companyAddr?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    companyEmail?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    companyPhone?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    customerName?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    customerGst?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    customerAddr?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    customerEmail?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    customerPhone?: StringNullableWithAggregatesFilter<"Billing"> | string | null
    customerId?: UuidNullableWithAggregatesFilter<"Billing"> | string | null
  }

  export type CustomerWhereInput = {
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    id?: UuidFilter<"Customer"> | string
    name?: StringFilter<"Customer"> | string
    gstNumber?: StringNullableFilter<"Customer"> | string | null
    address?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    billings?: BillingListRelationFilter
  }

  export type CustomerOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    gstNumber?: SortOrderInput | SortOrder
    address?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    billings?: BillingOrderByRelationAggregateInput
  }

  export type CustomerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CustomerWhereInput | CustomerWhereInput[]
    OR?: CustomerWhereInput[]
    NOT?: CustomerWhereInput | CustomerWhereInput[]
    gstNumber?: StringNullableFilter<"Customer"> | string | null
    address?: StringFilter<"Customer"> | string
    email?: StringNullableFilter<"Customer"> | string | null
    phone?: StringNullableFilter<"Customer"> | string | null
    createdAt?: DateTimeFilter<"Customer"> | Date | string
    billings?: BillingListRelationFilter
  }, "id" | "name">

  export type CustomerOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    gstNumber?: SortOrderInput | SortOrder
    address?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CustomerCountOrderByAggregateInput
    _max?: CustomerMaxOrderByAggregateInput
    _min?: CustomerMinOrderByAggregateInput
  }

  export type CustomerScalarWhereWithAggregatesInput = {
    AND?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    OR?: CustomerScalarWhereWithAggregatesInput[]
    NOT?: CustomerScalarWhereWithAggregatesInput | CustomerScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Customer"> | string
    name?: StringWithAggregatesFilter<"Customer"> | string
    gstNumber?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    address?: StringWithAggregatesFilter<"Customer"> | string
    email?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    phone?: StringNullableWithAggregatesFilter<"Customer"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Customer"> | Date | string
  }

  export type CompanySettingWhereInput = {
    AND?: CompanySettingWhereInput | CompanySettingWhereInput[]
    OR?: CompanySettingWhereInput[]
    NOT?: CompanySettingWhereInput | CompanySettingWhereInput[]
    id?: UuidFilter<"CompanySetting"> | string
    name?: StringFilter<"CompanySetting"> | string
    gstin?: StringFilter<"CompanySetting"> | string
    address?: StringFilter<"CompanySetting"> | string
    email?: StringNullableFilter<"CompanySetting"> | string | null
    phone?: StringNullableFilter<"CompanySetting"> | string | null
    createdAt?: DateTimeFilter<"CompanySetting"> | Date | string
  }

  export type CompanySettingOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    gstin?: SortOrder
    address?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type CompanySettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CompanySettingWhereInput | CompanySettingWhereInput[]
    OR?: CompanySettingWhereInput[]
    NOT?: CompanySettingWhereInput | CompanySettingWhereInput[]
    name?: StringFilter<"CompanySetting"> | string
    gstin?: StringFilter<"CompanySetting"> | string
    address?: StringFilter<"CompanySetting"> | string
    email?: StringNullableFilter<"CompanySetting"> | string | null
    phone?: StringNullableFilter<"CompanySetting"> | string | null
    createdAt?: DateTimeFilter<"CompanySetting"> | Date | string
  }, "id">

  export type CompanySettingOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    gstin?: SortOrder
    address?: SortOrder
    email?: SortOrderInput | SortOrder
    phone?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: CompanySettingCountOrderByAggregateInput
    _max?: CompanySettingMaxOrderByAggregateInput
    _min?: CompanySettingMinOrderByAggregateInput
  }

  export type CompanySettingScalarWhereWithAggregatesInput = {
    AND?: CompanySettingScalarWhereWithAggregatesInput | CompanySettingScalarWhereWithAggregatesInput[]
    OR?: CompanySettingScalarWhereWithAggregatesInput[]
    NOT?: CompanySettingScalarWhereWithAggregatesInput | CompanySettingScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"CompanySetting"> | string
    name?: StringWithAggregatesFilter<"CompanySetting"> | string
    gstin?: StringWithAggregatesFilter<"CompanySetting"> | string
    address?: StringWithAggregatesFilter<"CompanySetting"> | string
    email?: StringNullableWithAggregatesFilter<"CompanySetting"> | string | null
    phone?: StringNullableWithAggregatesFilter<"CompanySetting"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CompanySetting"> | Date | string
  }

  export type ModuleWhereInput = {
    AND?: ModuleWhereInput | ModuleWhereInput[]
    OR?: ModuleWhereInput[]
    NOT?: ModuleWhereInput | ModuleWhereInput[]
    id?: UuidFilter<"Module"> | string
    name?: StringFilter<"Module"> | string
    permissions?: PermissionListRelationFilter
  }

  export type ModuleOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    permissions?: PermissionOrderByRelationAggregateInput
  }

  export type ModuleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ModuleWhereInput | ModuleWhereInput[]
    OR?: ModuleWhereInput[]
    NOT?: ModuleWhereInput | ModuleWhereInput[]
    permissions?: PermissionListRelationFilter
  }, "id" | "name">

  export type ModuleOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    _count?: ModuleCountOrderByAggregateInput
    _max?: ModuleMaxOrderByAggregateInput
    _min?: ModuleMinOrderByAggregateInput
  }

  export type ModuleScalarWhereWithAggregatesInput = {
    AND?: ModuleScalarWhereWithAggregatesInput | ModuleScalarWhereWithAggregatesInput[]
    OR?: ModuleScalarWhereWithAggregatesInput[]
    NOT?: ModuleScalarWhereWithAggregatesInput | ModuleScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Module"> | string
    name?: StringWithAggregatesFilter<"Module"> | string
  }

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    id?: UuidFilter<"Permission"> | string
    roleId?: UuidFilter<"Permission"> | string
    moduleId?: UuidFilter<"Permission"> | string
    canView?: BoolFilter<"Permission"> | boolean
    canCreate?: BoolFilter<"Permission"> | boolean
    canEdit?: BoolFilter<"Permission"> | boolean
    canDelete?: BoolFilter<"Permission"> | boolean
    role?: XOR<RoleRelationFilter, RoleWhereInput>
    module?: XOR<ModuleRelationFilter, ModuleWhereInput>
  }

  export type PermissionOrderByWithRelationInput = {
    id?: SortOrder
    roleId?: SortOrder
    moduleId?: SortOrder
    canView?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
    role?: RoleOrderByWithRelationInput
    module?: ModuleOrderByWithRelationInput
  }

  export type PermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roleId_moduleId?: PermissionRoleIdModuleIdCompoundUniqueInput
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    roleId?: UuidFilter<"Permission"> | string
    moduleId?: UuidFilter<"Permission"> | string
    canView?: BoolFilter<"Permission"> | boolean
    canCreate?: BoolFilter<"Permission"> | boolean
    canEdit?: BoolFilter<"Permission"> | boolean
    canDelete?: BoolFilter<"Permission"> | boolean
    role?: XOR<RoleRelationFilter, RoleWhereInput>
    module?: XOR<ModuleRelationFilter, ModuleWhereInput>
  }, "id" | "roleId_moduleId">

  export type PermissionOrderByWithAggregationInput = {
    id?: SortOrder
    roleId?: SortOrder
    moduleId?: SortOrder
    canView?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
    _count?: PermissionCountOrderByAggregateInput
    _max?: PermissionMaxOrderByAggregateInput
    _min?: PermissionMinOrderByAggregateInput
  }

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    OR?: PermissionScalarWhereWithAggregatesInput[]
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Permission"> | string
    roleId?: UuidWithAggregatesFilter<"Permission"> | string
    moduleId?: UuidWithAggregatesFilter<"Permission"> | string
    canView?: BoolWithAggregatesFilter<"Permission"> | boolean
    canCreate?: BoolWithAggregatesFilter<"Permission"> | boolean
    canEdit?: BoolWithAggregatesFilter<"Permission"> | boolean
    canDelete?: BoolWithAggregatesFilter<"Permission"> | boolean
  }

  export type SystemLogWhereInput = {
    AND?: SystemLogWhereInput | SystemLogWhereInput[]
    OR?: SystemLogWhereInput[]
    NOT?: SystemLogWhereInput | SystemLogWhereInput[]
    id?: UuidFilter<"SystemLog"> | string
    timestamp?: DateTimeFilter<"SystemLog"> | Date | string
    user?: EnumLogUserFilter<"SystemLog"> | $Enums.LogUser
    action?: EnumLogActionFilter<"SystemLog"> | $Enums.LogAction
    item?: StringFilter<"SystemLog"> | string
    details?: StringFilter<"SystemLog"> | string
    status?: EnumLogStatusFilter<"SystemLog"> | $Enums.LogStatus
    plcOperation?: StringNullableFilter<"SystemLog"> | string | null
    plcAddress?: IntNullableFilter<"SystemLog"> | number | null
    plcValue?: StringNullableFilter<"SystemLog"> | string | null
    rackId?: StringNullableFilter<"SystemLog"> | string | null
    createdAt?: DateTimeFilter<"SystemLog"> | Date | string
  }

  export type SystemLogOrderByWithRelationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    user?: SortOrder
    action?: SortOrder
    item?: SortOrder
    details?: SortOrder
    status?: SortOrder
    plcOperation?: SortOrderInput | SortOrder
    plcAddress?: SortOrderInput | SortOrder
    plcValue?: SortOrderInput | SortOrder
    rackId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type SystemLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SystemLogWhereInput | SystemLogWhereInput[]
    OR?: SystemLogWhereInput[]
    NOT?: SystemLogWhereInput | SystemLogWhereInput[]
    timestamp?: DateTimeFilter<"SystemLog"> | Date | string
    user?: EnumLogUserFilter<"SystemLog"> | $Enums.LogUser
    action?: EnumLogActionFilter<"SystemLog"> | $Enums.LogAction
    item?: StringFilter<"SystemLog"> | string
    details?: StringFilter<"SystemLog"> | string
    status?: EnumLogStatusFilter<"SystemLog"> | $Enums.LogStatus
    plcOperation?: StringNullableFilter<"SystemLog"> | string | null
    plcAddress?: IntNullableFilter<"SystemLog"> | number | null
    plcValue?: StringNullableFilter<"SystemLog"> | string | null
    rackId?: StringNullableFilter<"SystemLog"> | string | null
    createdAt?: DateTimeFilter<"SystemLog"> | Date | string
  }, "id">

  export type SystemLogOrderByWithAggregationInput = {
    id?: SortOrder
    timestamp?: SortOrder
    user?: SortOrder
    action?: SortOrder
    item?: SortOrder
    details?: SortOrder
    status?: SortOrder
    plcOperation?: SortOrderInput | SortOrder
    plcAddress?: SortOrderInput | SortOrder
    plcValue?: SortOrderInput | SortOrder
    rackId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SystemLogCountOrderByAggregateInput
    _avg?: SystemLogAvgOrderByAggregateInput
    _max?: SystemLogMaxOrderByAggregateInput
    _min?: SystemLogMinOrderByAggregateInput
    _sum?: SystemLogSumOrderByAggregateInput
  }

  export type SystemLogScalarWhereWithAggregatesInput = {
    AND?: SystemLogScalarWhereWithAggregatesInput | SystemLogScalarWhereWithAggregatesInput[]
    OR?: SystemLogScalarWhereWithAggregatesInput[]
    NOT?: SystemLogScalarWhereWithAggregatesInput | SystemLogScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"SystemLog"> | string
    timestamp?: DateTimeWithAggregatesFilter<"SystemLog"> | Date | string
    user?: EnumLogUserWithAggregatesFilter<"SystemLog"> | $Enums.LogUser
    action?: EnumLogActionWithAggregatesFilter<"SystemLog"> | $Enums.LogAction
    item?: StringWithAggregatesFilter<"SystemLog"> | string
    details?: StringWithAggregatesFilter<"SystemLog"> | string
    status?: EnumLogStatusWithAggregatesFilter<"SystemLog"> | $Enums.LogStatus
    plcOperation?: StringNullableWithAggregatesFilter<"SystemLog"> | string | null
    plcAddress?: IntNullableWithAggregatesFilter<"SystemLog"> | number | null
    plcValue?: StringNullableWithAggregatesFilter<"SystemLog"> | string | null
    rackId?: StringNullableWithAggregatesFilter<"SystemLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SystemLog"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    role: RoleCreateNestedOneWithoutUsersInput
    transactions?: TransactionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    roleId: string
    createdAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
    transactions?: TransactionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    roleId: string
    createdAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    id?: string
    name: string
    users?: UserCreateNestedManyWithoutRoleInput
    permissions?: PermissionCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: string
    name: string
    users?: UserUncheckedCreateNestedManyWithoutRoleInput
    permissions?: PermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUpdateManyWithoutRoleNestedInput
    permissions?: PermissionUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUncheckedUpdateManyWithoutRoleNestedInput
    permissions?: PermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: string
    name: string
  }

  export type RoleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type CategoryCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    subcategories?: SubCategoryCreateNestedManyWithoutCategoryInput
    skus?: SKUCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    subcategories?: SubCategoryUncheckedCreateNestedManyWithoutCategoryInput
    skus?: SKUUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategories?: SubCategoryUpdateManyWithoutCategoryNestedInput
    skus?: SKUUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategories?: SubCategoryUncheckedUpdateManyWithoutCategoryNestedInput
    skus?: SKUUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryCreateManyInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type CategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCategoryCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutSubcategoriesInput
    skus?: SKUCreateNestedManyWithoutSubCategoryInput
  }

  export type SubCategoryUncheckedCreateInput = {
    id?: string
    name: string
    isActive?: boolean
    categoryId: string
    createdAt?: Date | string
    skus?: SKUUncheckedCreateNestedManyWithoutSubCategoryInput
  }

  export type SubCategoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutSubcategoriesNestedInput
    skus?: SKUUpdateManyWithoutSubCategoryNestedInput
  }

  export type SubCategoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: SKUUncheckedUpdateManyWithoutSubCategoryNestedInput
  }

  export type SubCategoryCreateManyInput = {
    id?: string
    name: string
    isActive?: boolean
    categoryId: string
    createdAt?: Date | string
  }

  export type SubCategoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SubCategoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SKUCreateInput = {
    id?: string
    skuCode: string
    productName: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutSkusInput
    subCategory: SubCategoryCreateNestedOneWithoutSkusInput
    inventories?: InventoryCreateNestedManyWithoutSkuInput
    transactions?: TransactionCreateNestedManyWithoutSkuInput
    billings?: BillingCreateNestedManyWithoutSkuInput
  }

  export type SKUUncheckedCreateInput = {
    id?: string
    skuCode: string
    productName: string
    categoryId: string
    subCategoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    inventories?: InventoryUncheckedCreateNestedManyWithoutSkuInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutSkuInput
    billings?: BillingUncheckedCreateNestedManyWithoutSkuInput
  }

  export type SKUUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutSkusNestedInput
    subCategory?: SubCategoryUpdateOneRequiredWithoutSkusNestedInput
    inventories?: InventoryUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUpdateManyWithoutSkuNestedInput
    billings?: BillingUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    subCategoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventories?: InventoryUncheckedUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutSkuNestedInput
    billings?: BillingUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type SKUCreateManyInput = {
    id?: string
    skuCode: string
    productName: string
    categoryId: string
    subCategoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
  }

  export type SKUUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SKUUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    subCategoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RackCreateInput = {
    id?: string
    name: string
    room: $Enums.Room
    shelves?: ShelfCreateNestedManyWithoutRackInput
  }

  export type RackUncheckedCreateInput = {
    id?: string
    name: string
    room: $Enums.Room
    shelves?: ShelfUncheckedCreateNestedManyWithoutRackInput
  }

  export type RackUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    room?: EnumRoomFieldUpdateOperationsInput | $Enums.Room
    shelves?: ShelfUpdateManyWithoutRackNestedInput
  }

  export type RackUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    room?: EnumRoomFieldUpdateOperationsInput | $Enums.Room
    shelves?: ShelfUncheckedUpdateManyWithoutRackNestedInput
  }

  export type RackCreateManyInput = {
    id?: string
    name: string
    room: $Enums.Room
  }

  export type RackUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    room?: EnumRoomFieldUpdateOperationsInput | $Enums.Room
  }

  export type RackUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    room?: EnumRoomFieldUpdateOperationsInput | $Enums.Room
  }

  export type ShelfCreateInput = {
    id?: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
    rack: RackCreateNestedOneWithoutShelvesInput
    inventories?: InventoryCreateNestedManyWithoutShelfInput
  }

  export type ShelfUncheckedCreateInput = {
    id?: string
    rackId: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
    inventories?: InventoryUncheckedCreateNestedManyWithoutShelfInput
  }

  export type ShelfUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
    rack?: RackUpdateOneRequiredWithoutShelvesNestedInput
    inventories?: InventoryUpdateManyWithoutShelfNestedInput
  }

  export type ShelfUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    rackId?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
    inventories?: InventoryUncheckedUpdateManyWithoutShelfNestedInput
  }

  export type ShelfCreateManyInput = {
    id?: string
    rackId: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
  }

  export type ShelfUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
  }

  export type ShelfUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    rackId?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
  }

  export type InventoryCreateInput = {
    id?: string
    quantity: number
    qrCode?: string | null
    sku: SKUCreateNestedOneWithoutInventoriesInput
    shelf: ShelfCreateNestedOneWithoutInventoriesInput
  }

  export type InventoryUncheckedCreateInput = {
    id?: string
    skuId: string
    shelfId: string
    quantity: number
    qrCode?: string | null
  }

  export type InventoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: SKUUpdateOneRequiredWithoutInventoriesNestedInput
    shelf?: ShelfUpdateOneRequiredWithoutInventoriesNestedInput
  }

  export type InventoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    shelfId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryCreateManyInput = {
    id?: string
    skuId: string
    shelfId: string
    quantity: number
    qrCode?: string | null
  }

  export type InventoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    shelfId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionCreateInput = {
    id?: string
    type: $Enums.TxType
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
    sku: SKUCreateNestedOneWithoutTransactionsInput
    user?: UserCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateInput = {
    id?: string
    type: $Enums.TxType
    skuId: string
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    userId?: string | null
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
  }

  export type TransactionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: SKUUpdateOneRequiredWithoutTransactionsNestedInput
    user?: UserUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    skuId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionCreateManyInput = {
    id?: string
    type: $Enums.TxType
    skuId: string
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    userId?: string | null
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
  }

  export type TransactionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    skuId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingCreateInput = {
    id?: string
    invoiceId: string
    orderId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    sku: SKUCreateNestedOneWithoutBillingsInput
    customer?: CustomerCreateNestedOneWithoutBillingsInput
  }

  export type BillingUncheckedCreateInput = {
    id?: string
    invoiceId: string
    orderId: string
    skuId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerId?: string | null
  }

  export type BillingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: SKUUpdateOneRequiredWithoutBillingsNestedInput
    customer?: CustomerUpdateOneWithoutBillingsNestedInput
  }

  export type BillingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingCreateManyInput = {
    id?: string
    invoiceId: string
    orderId: string
    skuId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerId?: string | null
  }

  export type BillingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type CustomerCreateInput = {
    id?: string
    name: string
    gstNumber?: string | null
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
    billings?: BillingCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUncheckedCreateInput = {
    id?: string
    name: string
    gstNumber?: string | null
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
    billings?: BillingUncheckedCreateNestedManyWithoutCustomerInput
  }

  export type CustomerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billings?: BillingUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    billings?: BillingUncheckedUpdateManyWithoutCustomerNestedInput
  }

  export type CustomerCreateManyInput = {
    id?: string
    name: string
    gstNumber?: string | null
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
  }

  export type CustomerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanySettingCreateInput = {
    id?: string
    name: string
    gstin: string
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
  }

  export type CompanySettingUncheckedCreateInput = {
    id?: string
    name: string
    gstin: string
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
  }

  export type CompanySettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanySettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanySettingCreateManyInput = {
    id?: string
    name: string
    gstin: string
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
  }

  export type CompanySettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanySettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstin?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ModuleCreateInput = {
    id?: string
    name: string
    permissions?: PermissionCreateNestedManyWithoutModuleInput
  }

  export type ModuleUncheckedCreateInput = {
    id?: string
    name: string
    permissions?: PermissionUncheckedCreateNestedManyWithoutModuleInput
  }

  export type ModuleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: PermissionUpdateManyWithoutModuleNestedInput
  }

  export type ModuleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: PermissionUncheckedUpdateManyWithoutModuleNestedInput
  }

  export type ModuleCreateManyInput = {
    id?: string
    name: string
  }

  export type ModuleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ModuleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type PermissionCreateInput = {
    id?: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    role: RoleCreateNestedOneWithoutPermissionsInput
    module: ModuleCreateNestedOneWithoutPermissionsInput
  }

  export type PermissionUncheckedCreateInput = {
    id?: string
    roleId: string
    moduleId: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }

  export type PermissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    role?: RoleUpdateOneRequiredWithoutPermissionsNestedInput
    module?: ModuleUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type PermissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PermissionCreateManyInput = {
    id?: string
    roleId: string
    moduleId: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }

  export type PermissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PermissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SystemLogCreateInput = {
    id?: string
    timestamp?: Date | string
    user: $Enums.LogUser
    action: $Enums.LogAction
    item: string
    details: string
    status?: $Enums.LogStatus
    plcOperation?: string | null
    plcAddress?: number | null
    plcValue?: string | null
    rackId?: string | null
    createdAt?: Date | string
  }

  export type SystemLogUncheckedCreateInput = {
    id?: string
    timestamp?: Date | string
    user: $Enums.LogUser
    action: $Enums.LogAction
    item: string
    details: string
    status?: $Enums.LogStatus
    plcOperation?: string | null
    plcAddress?: number | null
    plcValue?: string | null
    rackId?: string | null
    createdAt?: Date | string
  }

  export type SystemLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: EnumLogUserFieldUpdateOperationsInput | $Enums.LogUser
    action?: EnumLogActionFieldUpdateOperationsInput | $Enums.LogAction
    item?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    status?: EnumLogStatusFieldUpdateOperationsInput | $Enums.LogStatus
    plcOperation?: NullableStringFieldUpdateOperationsInput | string | null
    plcAddress?: NullableIntFieldUpdateOperationsInput | number | null
    plcValue?: NullableStringFieldUpdateOperationsInput | string | null
    rackId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: EnumLogUserFieldUpdateOperationsInput | $Enums.LogUser
    action?: EnumLogActionFieldUpdateOperationsInput | $Enums.LogAction
    item?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    status?: EnumLogStatusFieldUpdateOperationsInput | $Enums.LogStatus
    plcOperation?: NullableStringFieldUpdateOperationsInput | string | null
    plcAddress?: NullableIntFieldUpdateOperationsInput | number | null
    plcValue?: NullableStringFieldUpdateOperationsInput | string | null
    rackId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemLogCreateManyInput = {
    id?: string
    timestamp?: Date | string
    user: $Enums.LogUser
    action: $Enums.LogAction
    item: string
    details: string
    status?: $Enums.LogStatus
    plcOperation?: string | null
    plcAddress?: number | null
    plcValue?: string | null
    rackId?: string | null
    createdAt?: Date | string
  }

  export type SystemLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: EnumLogUserFieldUpdateOperationsInput | $Enums.LogUser
    action?: EnumLogActionFieldUpdateOperationsInput | $Enums.LogAction
    item?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    status?: EnumLogStatusFieldUpdateOperationsInput | $Enums.LogStatus
    plcOperation?: NullableStringFieldUpdateOperationsInput | string | null
    plcAddress?: NullableIntFieldUpdateOperationsInput | number | null
    plcValue?: NullableStringFieldUpdateOperationsInput | string | null
    rackId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: EnumLogUserFieldUpdateOperationsInput | $Enums.LogUser
    action?: EnumLogActionFieldUpdateOperationsInput | $Enums.LogAction
    item?: StringFieldUpdateOperationsInput | string
    details?: StringFieldUpdateOperationsInput | string
    status?: EnumLogStatusFieldUpdateOperationsInput | $Enums.LogStatus
    plcOperation?: NullableStringFieldUpdateOperationsInput | string | null
    plcAddress?: NullableIntFieldUpdateOperationsInput | number | null
    plcValue?: NullableStringFieldUpdateOperationsInput | string | null
    rackId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type RoleRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type TransactionListRelationFilter = {
    every?: TransactionWhereInput
    some?: TransactionWhereInput
    none?: TransactionWhereInput
  }

  export type TransactionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type PermissionListRelationFilter = {
    every?: PermissionWhereInput
    some?: PermissionWhereInput
    none?: PermissionWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SubCategoryListRelationFilter = {
    every?: SubCategoryWhereInput
    some?: SubCategoryWhereInput
    none?: SubCategoryWhereInput
  }

  export type SKUListRelationFilter = {
    every?: SKUWhereInput
    some?: SKUWhereInput
    none?: SKUWhereInput
  }

  export type SubCategoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SKUOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type CategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type CategoryRelationFilter = {
    is?: CategoryWhereInput
    isNot?: CategoryWhereInput
  }

  export type SubCategoryCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
  }

  export type SubCategoryMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
  }

  export type SubCategoryMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    isActive?: SortOrder
    categoryId?: SortOrder
    createdAt?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type SubCategoryRelationFilter = {
    is?: SubCategoryWhereInput
    isNot?: SubCategoryWhereInput
  }

  export type InventoryListRelationFilter = {
    every?: InventoryWhereInput
    some?: InventoryWhereInput
    none?: InventoryWhereInput
  }

  export type BillingListRelationFilter = {
    every?: BillingWhereInput
    some?: BillingWhereInput
    none?: BillingWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type InventoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BillingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SKUCountOrderByAggregateInput = {
    id?: SortOrder
    skuCode?: SortOrder
    productName?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    length?: SortOrder
    width?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    barcode?: SortOrder
    barcodeFormat?: SortOrder
    stock?: SortOrder
    rackLocation?: SortOrder
    createdAt?: SortOrder
  }

  export type SKUAvgOrderByAggregateInput = {
    length?: SortOrder
    width?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    stock?: SortOrder
  }

  export type SKUMaxOrderByAggregateInput = {
    id?: SortOrder
    skuCode?: SortOrder
    productName?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    length?: SortOrder
    width?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    barcode?: SortOrder
    barcodeFormat?: SortOrder
    stock?: SortOrder
    rackLocation?: SortOrder
    createdAt?: SortOrder
  }

  export type SKUMinOrderByAggregateInput = {
    id?: SortOrder
    skuCode?: SortOrder
    productName?: SortOrder
    categoryId?: SortOrder
    subCategoryId?: SortOrder
    length?: SortOrder
    width?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    barcode?: SortOrder
    barcodeFormat?: SortOrder
    stock?: SortOrder
    rackLocation?: SortOrder
    createdAt?: SortOrder
  }

  export type SKUSumOrderByAggregateInput = {
    length?: SortOrder
    width?: SortOrder
    height?: SortOrder
    weight?: SortOrder
    stock?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumRoomFilter<$PrismaModel = never> = {
    equals?: $Enums.Room | EnumRoomFieldRefInput<$PrismaModel>
    in?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    notIn?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomFilter<$PrismaModel> | $Enums.Room
  }

  export type ShelfListRelationFilter = {
    every?: ShelfWhereInput
    some?: ShelfWhereInput
    none?: ShelfWhereInput
  }

  export type ShelfOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RackCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    room?: SortOrder
  }

  export type RackMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    room?: SortOrder
  }

  export type RackMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    room?: SortOrder
  }

  export type EnumRoomWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Room | EnumRoomFieldRefInput<$PrismaModel>
    in?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    notIn?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomWithAggregatesFilter<$PrismaModel> | $Enums.Room
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoomFilter<$PrismaModel>
    _max?: NestedEnumRoomFilter<$PrismaModel>
  }

  export type EnumLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | EnumLevelFieldRefInput<$PrismaModel>
    in?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLevelFilter<$PrismaModel> | $Enums.Level
  }

  export type RackRelationFilter = {
    is?: RackWhereInput
    isNot?: RackWhereInput
  }

  export type ShelfCountOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    maxVolume?: SortOrder
    maxWeight?: SortOrder
    usedVolume?: SortOrder
    usedWeight?: SortOrder
  }

  export type ShelfAvgOrderByAggregateInput = {
    maxVolume?: SortOrder
    maxWeight?: SortOrder
    usedVolume?: SortOrder
    usedWeight?: SortOrder
  }

  export type ShelfMaxOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    maxVolume?: SortOrder
    maxWeight?: SortOrder
    usedVolume?: SortOrder
    usedWeight?: SortOrder
  }

  export type ShelfMinOrderByAggregateInput = {
    id?: SortOrder
    rackId?: SortOrder
    level?: SortOrder
    maxVolume?: SortOrder
    maxWeight?: SortOrder
    usedVolume?: SortOrder
    usedWeight?: SortOrder
  }

  export type ShelfSumOrderByAggregateInput = {
    maxVolume?: SortOrder
    maxWeight?: SortOrder
    usedVolume?: SortOrder
    usedWeight?: SortOrder
  }

  export type EnumLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | EnumLevelFieldRefInput<$PrismaModel>
    in?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLevelWithAggregatesFilter<$PrismaModel> | $Enums.Level
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLevelFilter<$PrismaModel>
    _max?: NestedEnumLevelFilter<$PrismaModel>
  }

  export type SKURelationFilter = {
    is?: SKUWhereInput
    isNot?: SKUWhereInput
  }

  export type ShelfRelationFilter = {
    is?: ShelfWhereInput
    isNot?: ShelfWhereInput
  }

  export type InventoryCountOrderByAggregateInput = {
    id?: SortOrder
    skuId?: SortOrder
    shelfId?: SortOrder
    quantity?: SortOrder
    qrCode?: SortOrder
  }

  export type InventoryAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type InventoryMaxOrderByAggregateInput = {
    id?: SortOrder
    skuId?: SortOrder
    shelfId?: SortOrder
    quantity?: SortOrder
    qrCode?: SortOrder
  }

  export type InventoryMinOrderByAggregateInput = {
    id?: SortOrder
    skuId?: SortOrder
    shelfId?: SortOrder
    quantity?: SortOrder
    qrCode?: SortOrder
  }

  export type InventorySumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumTxTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TxType | EnumTxTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTxTypeFilter<$PrismaModel> | $Enums.TxType
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type TransactionCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    skuId?: SortOrder
    quantity?: SortOrder
    rackLocation?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    barcodeValue?: SortOrder
    barcodeNumber?: SortOrder
    barcodeImageData?: SortOrder
  }

  export type TransactionAvgOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type TransactionMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    skuId?: SortOrder
    quantity?: SortOrder
    rackLocation?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    barcodeValue?: SortOrder
    barcodeNumber?: SortOrder
    barcodeImageData?: SortOrder
  }

  export type TransactionMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    skuId?: SortOrder
    quantity?: SortOrder
    rackLocation?: SortOrder
    status?: SortOrder
    timestamp?: SortOrder
    userId?: SortOrder
    barcodeValue?: SortOrder
    barcodeNumber?: SortOrder
    barcodeImageData?: SortOrder
  }

  export type TransactionSumOrderByAggregateInput = {
    quantity?: SortOrder
  }

  export type EnumTxTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TxType | EnumTxTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTxTypeWithAggregatesFilter<$PrismaModel> | $Enums.TxType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTxTypeFilter<$PrismaModel>
    _max?: NestedEnumTxTypeFilter<$PrismaModel>
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type CustomerNullableRelationFilter = {
    is?: CustomerWhereInput | null
    isNot?: CustomerWhereInput | null
  }

  export type BillingCountOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    orderId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    rackHistory?: SortOrder
    duration?: SortOrder
    weightCharges?: SortOrder
    rackCharges?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    gstPercent?: SortOrder
    companyName?: SortOrder
    companyGst?: SortOrder
    companyAddr?: SortOrder
    companyEmail?: SortOrder
    companyPhone?: SortOrder
    customerName?: SortOrder
    customerGst?: SortOrder
    customerAddr?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    customerId?: SortOrder
  }

  export type BillingAvgOrderByAggregateInput = {
    duration?: SortOrder
    weightCharges?: SortOrder
    rackCharges?: SortOrder
    amount?: SortOrder
    gstPercent?: SortOrder
  }

  export type BillingMaxOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    orderId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    rackHistory?: SortOrder
    duration?: SortOrder
    weightCharges?: SortOrder
    rackCharges?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    gstPercent?: SortOrder
    companyName?: SortOrder
    companyGst?: SortOrder
    companyAddr?: SortOrder
    companyEmail?: SortOrder
    companyPhone?: SortOrder
    customerName?: SortOrder
    customerGst?: SortOrder
    customerAddr?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    customerId?: SortOrder
  }

  export type BillingMinOrderByAggregateInput = {
    id?: SortOrder
    invoiceId?: SortOrder
    orderId?: SortOrder
    skuId?: SortOrder
    productName?: SortOrder
    rackHistory?: SortOrder
    duration?: SortOrder
    weightCharges?: SortOrder
    rackCharges?: SortOrder
    amount?: SortOrder
    status?: SortOrder
    date?: SortOrder
    gstPercent?: SortOrder
    companyName?: SortOrder
    companyGst?: SortOrder
    companyAddr?: SortOrder
    companyEmail?: SortOrder
    companyPhone?: SortOrder
    customerName?: SortOrder
    customerGst?: SortOrder
    customerAddr?: SortOrder
    customerEmail?: SortOrder
    customerPhone?: SortOrder
    customerId?: SortOrder
  }

  export type BillingSumOrderByAggregateInput = {
    duration?: SortOrder
    weightCharges?: SortOrder
    rackCharges?: SortOrder
    amount?: SortOrder
    gstPercent?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type CustomerCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gstNumber?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gstNumber?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
  }

  export type CustomerMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gstNumber?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanySettingCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gstin?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanySettingMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gstin?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
  }

  export type CompanySettingMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    gstin?: SortOrder
    address?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    createdAt?: SortOrder
  }

  export type ModuleCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ModuleMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ModuleMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
  }

  export type ModuleRelationFilter = {
    is?: ModuleWhereInput
    isNot?: ModuleWhereInput
  }

  export type PermissionRoleIdModuleIdCompoundUniqueInput = {
    roleId: string
    moduleId: string
  }

  export type PermissionCountOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    moduleId?: SortOrder
    canView?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
  }

  export type PermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    moduleId?: SortOrder
    canView?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
  }

  export type PermissionMinOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    moduleId?: SortOrder
    canView?: SortOrder
    canCreate?: SortOrder
    canEdit?: SortOrder
    canDelete?: SortOrder
  }

  export type EnumLogUserFilter<$PrismaModel = never> = {
    equals?: $Enums.LogUser | EnumLogUserFieldRefInput<$PrismaModel>
    in?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    not?: NestedEnumLogUserFilter<$PrismaModel> | $Enums.LogUser
  }

  export type EnumLogActionFilter<$PrismaModel = never> = {
    equals?: $Enums.LogAction | EnumLogActionFieldRefInput<$PrismaModel>
    in?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLogActionFilter<$PrismaModel> | $Enums.LogAction
  }

  export type EnumLogStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LogStatus | EnumLogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLogStatusFilter<$PrismaModel> | $Enums.LogStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type SystemLogCountOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    user?: SortOrder
    action?: SortOrder
    item?: SortOrder
    details?: SortOrder
    status?: SortOrder
    plcOperation?: SortOrder
    plcAddress?: SortOrder
    plcValue?: SortOrder
    rackId?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemLogAvgOrderByAggregateInput = {
    plcAddress?: SortOrder
  }

  export type SystemLogMaxOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    user?: SortOrder
    action?: SortOrder
    item?: SortOrder
    details?: SortOrder
    status?: SortOrder
    plcOperation?: SortOrder
    plcAddress?: SortOrder
    plcValue?: SortOrder
    rackId?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemLogMinOrderByAggregateInput = {
    id?: SortOrder
    timestamp?: SortOrder
    user?: SortOrder
    action?: SortOrder
    item?: SortOrder
    details?: SortOrder
    status?: SortOrder
    plcOperation?: SortOrder
    plcAddress?: SortOrder
    plcValue?: SortOrder
    rackId?: SortOrder
    createdAt?: SortOrder
  }

  export type SystemLogSumOrderByAggregateInput = {
    plcAddress?: SortOrder
  }

  export type EnumLogUserWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogUser | EnumLogUserFieldRefInput<$PrismaModel>
    in?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    not?: NestedEnumLogUserWithAggregatesFilter<$PrismaModel> | $Enums.LogUser
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogUserFilter<$PrismaModel>
    _max?: NestedEnumLogUserFilter<$PrismaModel>
  }

  export type EnumLogActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogAction | EnumLogActionFieldRefInput<$PrismaModel>
    in?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLogActionWithAggregatesFilter<$PrismaModel> | $Enums.LogAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogActionFilter<$PrismaModel>
    _max?: NestedEnumLogActionFilter<$PrismaModel>
  }

  export type EnumLogStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogStatus | EnumLogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLogStatusWithAggregatesFilter<$PrismaModel> | $Enums.LogStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogStatusFilter<$PrismaModel>
    _max?: NestedEnumLogStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type RoleCreateNestedOneWithoutUsersInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    connect?: RoleWhereUniqueInput
  }

  export type TransactionCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type RoleUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    upsert?: RoleUpsertWithoutUsersInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUsersInput, RoleUpdateWithoutUsersInput>, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type TransactionUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput> | TransactionCreateWithoutUserInput[] | TransactionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutUserInput | TransactionCreateOrConnectWithoutUserInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutUserInput | TransactionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TransactionCreateManyUserInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutUserInput | TransactionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutUserInput | TransactionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type PermissionCreateNestedManyWithoutRoleInput = {
    create?: XOR<PermissionCreateWithoutRoleInput, PermissionUncheckedCreateWithoutRoleInput> | PermissionCreateWithoutRoleInput[] | PermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutRoleInput | PermissionCreateOrConnectWithoutRoleInput[]
    createMany?: PermissionCreateManyRoleInputEnvelope
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type PermissionUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<PermissionCreateWithoutRoleInput, PermissionUncheckedCreateWithoutRoleInput> | PermissionCreateWithoutRoleInput[] | PermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutRoleInput | PermissionCreateOrConnectWithoutRoleInput[]
    createMany?: PermissionCreateManyRoleInputEnvelope
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutRoleInput | UserUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutRoleInput | UserUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutRoleInput | UserUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type PermissionUpdateManyWithoutRoleNestedInput = {
    create?: XOR<PermissionCreateWithoutRoleInput, PermissionUncheckedCreateWithoutRoleInput> | PermissionCreateWithoutRoleInput[] | PermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutRoleInput | PermissionCreateOrConnectWithoutRoleInput[]
    upsert?: PermissionUpsertWithWhereUniqueWithoutRoleInput | PermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: PermissionCreateManyRoleInputEnvelope
    set?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    disconnect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    delete?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    update?: PermissionUpdateWithWhereUniqueWithoutRoleInput | PermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: PermissionUpdateManyWithWhereWithoutRoleInput | PermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: PermissionScalarWhereInput | PermissionScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutRoleInput | UserUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutRoleInput | UserUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutRoleInput | UserUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type PermissionUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<PermissionCreateWithoutRoleInput, PermissionUncheckedCreateWithoutRoleInput> | PermissionCreateWithoutRoleInput[] | PermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutRoleInput | PermissionCreateOrConnectWithoutRoleInput[]
    upsert?: PermissionUpsertWithWhereUniqueWithoutRoleInput | PermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: PermissionCreateManyRoleInputEnvelope
    set?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    disconnect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    delete?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    update?: PermissionUpdateWithWhereUniqueWithoutRoleInput | PermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: PermissionUpdateManyWithWhereWithoutRoleInput | PermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: PermissionScalarWhereInput | PermissionScalarWhereInput[]
  }

  export type SubCategoryCreateNestedManyWithoutCategoryInput = {
    create?: XOR<SubCategoryCreateWithoutCategoryInput, SubCategoryUncheckedCreateWithoutCategoryInput> | SubCategoryCreateWithoutCategoryInput[] | SubCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SubCategoryCreateOrConnectWithoutCategoryInput | SubCategoryCreateOrConnectWithoutCategoryInput[]
    createMany?: SubCategoryCreateManyCategoryInputEnvelope
    connect?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
  }

  export type SKUCreateNestedManyWithoutCategoryInput = {
    create?: XOR<SKUCreateWithoutCategoryInput, SKUUncheckedCreateWithoutCategoryInput> | SKUCreateWithoutCategoryInput[] | SKUUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutCategoryInput | SKUCreateOrConnectWithoutCategoryInput[]
    createMany?: SKUCreateManyCategoryInputEnvelope
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
  }

  export type SubCategoryUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<SubCategoryCreateWithoutCategoryInput, SubCategoryUncheckedCreateWithoutCategoryInput> | SubCategoryCreateWithoutCategoryInput[] | SubCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SubCategoryCreateOrConnectWithoutCategoryInput | SubCategoryCreateOrConnectWithoutCategoryInput[]
    createMany?: SubCategoryCreateManyCategoryInputEnvelope
    connect?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
  }

  export type SKUUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: XOR<SKUCreateWithoutCategoryInput, SKUUncheckedCreateWithoutCategoryInput> | SKUCreateWithoutCategoryInput[] | SKUUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutCategoryInput | SKUCreateOrConnectWithoutCategoryInput[]
    createMany?: SKUCreateManyCategoryInputEnvelope
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SubCategoryUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<SubCategoryCreateWithoutCategoryInput, SubCategoryUncheckedCreateWithoutCategoryInput> | SubCategoryCreateWithoutCategoryInput[] | SubCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SubCategoryCreateOrConnectWithoutCategoryInput | SubCategoryCreateOrConnectWithoutCategoryInput[]
    upsert?: SubCategoryUpsertWithWhereUniqueWithoutCategoryInput | SubCategoryUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: SubCategoryCreateManyCategoryInputEnvelope
    set?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    disconnect?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    delete?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    connect?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    update?: SubCategoryUpdateWithWhereUniqueWithoutCategoryInput | SubCategoryUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: SubCategoryUpdateManyWithWhereWithoutCategoryInput | SubCategoryUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: SubCategoryScalarWhereInput | SubCategoryScalarWhereInput[]
  }

  export type SKUUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<SKUCreateWithoutCategoryInput, SKUUncheckedCreateWithoutCategoryInput> | SKUCreateWithoutCategoryInput[] | SKUUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutCategoryInput | SKUCreateOrConnectWithoutCategoryInput[]
    upsert?: SKUUpsertWithWhereUniqueWithoutCategoryInput | SKUUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: SKUCreateManyCategoryInputEnvelope
    set?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    disconnect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    delete?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    update?: SKUUpdateWithWhereUniqueWithoutCategoryInput | SKUUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: SKUUpdateManyWithWhereWithoutCategoryInput | SKUUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: SKUScalarWhereInput | SKUScalarWhereInput[]
  }

  export type SubCategoryUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<SubCategoryCreateWithoutCategoryInput, SubCategoryUncheckedCreateWithoutCategoryInput> | SubCategoryCreateWithoutCategoryInput[] | SubCategoryUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SubCategoryCreateOrConnectWithoutCategoryInput | SubCategoryCreateOrConnectWithoutCategoryInput[]
    upsert?: SubCategoryUpsertWithWhereUniqueWithoutCategoryInput | SubCategoryUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: SubCategoryCreateManyCategoryInputEnvelope
    set?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    disconnect?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    delete?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    connect?: SubCategoryWhereUniqueInput | SubCategoryWhereUniqueInput[]
    update?: SubCategoryUpdateWithWhereUniqueWithoutCategoryInput | SubCategoryUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: SubCategoryUpdateManyWithWhereWithoutCategoryInput | SubCategoryUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: SubCategoryScalarWhereInput | SubCategoryScalarWhereInput[]
  }

  export type SKUUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: XOR<SKUCreateWithoutCategoryInput, SKUUncheckedCreateWithoutCategoryInput> | SKUCreateWithoutCategoryInput[] | SKUUncheckedCreateWithoutCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutCategoryInput | SKUCreateOrConnectWithoutCategoryInput[]
    upsert?: SKUUpsertWithWhereUniqueWithoutCategoryInput | SKUUpsertWithWhereUniqueWithoutCategoryInput[]
    createMany?: SKUCreateManyCategoryInputEnvelope
    set?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    disconnect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    delete?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    update?: SKUUpdateWithWhereUniqueWithoutCategoryInput | SKUUpdateWithWhereUniqueWithoutCategoryInput[]
    updateMany?: SKUUpdateManyWithWhereWithoutCategoryInput | SKUUpdateManyWithWhereWithoutCategoryInput[]
    deleteMany?: SKUScalarWhereInput | SKUScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutSubcategoriesInput = {
    create?: XOR<CategoryCreateWithoutSubcategoriesInput, CategoryUncheckedCreateWithoutSubcategoriesInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutSubcategoriesInput
    connect?: CategoryWhereUniqueInput
  }

  export type SKUCreateNestedManyWithoutSubCategoryInput = {
    create?: XOR<SKUCreateWithoutSubCategoryInput, SKUUncheckedCreateWithoutSubCategoryInput> | SKUCreateWithoutSubCategoryInput[] | SKUUncheckedCreateWithoutSubCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutSubCategoryInput | SKUCreateOrConnectWithoutSubCategoryInput[]
    createMany?: SKUCreateManySubCategoryInputEnvelope
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
  }

  export type SKUUncheckedCreateNestedManyWithoutSubCategoryInput = {
    create?: XOR<SKUCreateWithoutSubCategoryInput, SKUUncheckedCreateWithoutSubCategoryInput> | SKUCreateWithoutSubCategoryInput[] | SKUUncheckedCreateWithoutSubCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutSubCategoryInput | SKUCreateOrConnectWithoutSubCategoryInput[]
    createMany?: SKUCreateManySubCategoryInputEnvelope
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
  }

  export type CategoryUpdateOneRequiredWithoutSubcategoriesNestedInput = {
    create?: XOR<CategoryCreateWithoutSubcategoriesInput, CategoryUncheckedCreateWithoutSubcategoriesInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutSubcategoriesInput
    upsert?: CategoryUpsertWithoutSubcategoriesInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutSubcategoriesInput, CategoryUpdateWithoutSubcategoriesInput>, CategoryUncheckedUpdateWithoutSubcategoriesInput>
  }

  export type SKUUpdateManyWithoutSubCategoryNestedInput = {
    create?: XOR<SKUCreateWithoutSubCategoryInput, SKUUncheckedCreateWithoutSubCategoryInput> | SKUCreateWithoutSubCategoryInput[] | SKUUncheckedCreateWithoutSubCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutSubCategoryInput | SKUCreateOrConnectWithoutSubCategoryInput[]
    upsert?: SKUUpsertWithWhereUniqueWithoutSubCategoryInput | SKUUpsertWithWhereUniqueWithoutSubCategoryInput[]
    createMany?: SKUCreateManySubCategoryInputEnvelope
    set?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    disconnect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    delete?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    update?: SKUUpdateWithWhereUniqueWithoutSubCategoryInput | SKUUpdateWithWhereUniqueWithoutSubCategoryInput[]
    updateMany?: SKUUpdateManyWithWhereWithoutSubCategoryInput | SKUUpdateManyWithWhereWithoutSubCategoryInput[]
    deleteMany?: SKUScalarWhereInput | SKUScalarWhereInput[]
  }

  export type SKUUncheckedUpdateManyWithoutSubCategoryNestedInput = {
    create?: XOR<SKUCreateWithoutSubCategoryInput, SKUUncheckedCreateWithoutSubCategoryInput> | SKUCreateWithoutSubCategoryInput[] | SKUUncheckedCreateWithoutSubCategoryInput[]
    connectOrCreate?: SKUCreateOrConnectWithoutSubCategoryInput | SKUCreateOrConnectWithoutSubCategoryInput[]
    upsert?: SKUUpsertWithWhereUniqueWithoutSubCategoryInput | SKUUpsertWithWhereUniqueWithoutSubCategoryInput[]
    createMany?: SKUCreateManySubCategoryInputEnvelope
    set?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    disconnect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    delete?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    connect?: SKUWhereUniqueInput | SKUWhereUniqueInput[]
    update?: SKUUpdateWithWhereUniqueWithoutSubCategoryInput | SKUUpdateWithWhereUniqueWithoutSubCategoryInput[]
    updateMany?: SKUUpdateManyWithWhereWithoutSubCategoryInput | SKUUpdateManyWithWhereWithoutSubCategoryInput[]
    deleteMany?: SKUScalarWhereInput | SKUScalarWhereInput[]
  }

  export type CategoryCreateNestedOneWithoutSkusInput = {
    create?: XOR<CategoryCreateWithoutSkusInput, CategoryUncheckedCreateWithoutSkusInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutSkusInput
    connect?: CategoryWhereUniqueInput
  }

  export type SubCategoryCreateNestedOneWithoutSkusInput = {
    create?: XOR<SubCategoryCreateWithoutSkusInput, SubCategoryUncheckedCreateWithoutSkusInput>
    connectOrCreate?: SubCategoryCreateOrConnectWithoutSkusInput
    connect?: SubCategoryWhereUniqueInput
  }

  export type InventoryCreateNestedManyWithoutSkuInput = {
    create?: XOR<InventoryCreateWithoutSkuInput, InventoryUncheckedCreateWithoutSkuInput> | InventoryCreateWithoutSkuInput[] | InventoryUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutSkuInput | InventoryCreateOrConnectWithoutSkuInput[]
    createMany?: InventoryCreateManySkuInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type TransactionCreateNestedManyWithoutSkuInput = {
    create?: XOR<TransactionCreateWithoutSkuInput, TransactionUncheckedCreateWithoutSkuInput> | TransactionCreateWithoutSkuInput[] | TransactionUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSkuInput | TransactionCreateOrConnectWithoutSkuInput[]
    createMany?: TransactionCreateManySkuInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type BillingCreateNestedManyWithoutSkuInput = {
    create?: XOR<BillingCreateWithoutSkuInput, BillingUncheckedCreateWithoutSkuInput> | BillingCreateWithoutSkuInput[] | BillingUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutSkuInput | BillingCreateOrConnectWithoutSkuInput[]
    createMany?: BillingCreateManySkuInputEnvelope
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
  }

  export type InventoryUncheckedCreateNestedManyWithoutSkuInput = {
    create?: XOR<InventoryCreateWithoutSkuInput, InventoryUncheckedCreateWithoutSkuInput> | InventoryCreateWithoutSkuInput[] | InventoryUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutSkuInput | InventoryCreateOrConnectWithoutSkuInput[]
    createMany?: InventoryCreateManySkuInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type TransactionUncheckedCreateNestedManyWithoutSkuInput = {
    create?: XOR<TransactionCreateWithoutSkuInput, TransactionUncheckedCreateWithoutSkuInput> | TransactionCreateWithoutSkuInput[] | TransactionUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSkuInput | TransactionCreateOrConnectWithoutSkuInput[]
    createMany?: TransactionCreateManySkuInputEnvelope
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
  }

  export type BillingUncheckedCreateNestedManyWithoutSkuInput = {
    create?: XOR<BillingCreateWithoutSkuInput, BillingUncheckedCreateWithoutSkuInput> | BillingCreateWithoutSkuInput[] | BillingUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutSkuInput | BillingCreateOrConnectWithoutSkuInput[]
    createMany?: BillingCreateManySkuInputEnvelope
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CategoryUpdateOneRequiredWithoutSkusNestedInput = {
    create?: XOR<CategoryCreateWithoutSkusInput, CategoryUncheckedCreateWithoutSkusInput>
    connectOrCreate?: CategoryCreateOrConnectWithoutSkusInput
    upsert?: CategoryUpsertWithoutSkusInput
    connect?: CategoryWhereUniqueInput
    update?: XOR<XOR<CategoryUpdateToOneWithWhereWithoutSkusInput, CategoryUpdateWithoutSkusInput>, CategoryUncheckedUpdateWithoutSkusInput>
  }

  export type SubCategoryUpdateOneRequiredWithoutSkusNestedInput = {
    create?: XOR<SubCategoryCreateWithoutSkusInput, SubCategoryUncheckedCreateWithoutSkusInput>
    connectOrCreate?: SubCategoryCreateOrConnectWithoutSkusInput
    upsert?: SubCategoryUpsertWithoutSkusInput
    connect?: SubCategoryWhereUniqueInput
    update?: XOR<XOR<SubCategoryUpdateToOneWithWhereWithoutSkusInput, SubCategoryUpdateWithoutSkusInput>, SubCategoryUncheckedUpdateWithoutSkusInput>
  }

  export type InventoryUpdateManyWithoutSkuNestedInput = {
    create?: XOR<InventoryCreateWithoutSkuInput, InventoryUncheckedCreateWithoutSkuInput> | InventoryCreateWithoutSkuInput[] | InventoryUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutSkuInput | InventoryCreateOrConnectWithoutSkuInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutSkuInput | InventoryUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: InventoryCreateManySkuInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutSkuInput | InventoryUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutSkuInput | InventoryUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type TransactionUpdateManyWithoutSkuNestedInput = {
    create?: XOR<TransactionCreateWithoutSkuInput, TransactionUncheckedCreateWithoutSkuInput> | TransactionCreateWithoutSkuInput[] | TransactionUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSkuInput | TransactionCreateOrConnectWithoutSkuInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutSkuInput | TransactionUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: TransactionCreateManySkuInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutSkuInput | TransactionUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutSkuInput | TransactionUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type BillingUpdateManyWithoutSkuNestedInput = {
    create?: XOR<BillingCreateWithoutSkuInput, BillingUncheckedCreateWithoutSkuInput> | BillingCreateWithoutSkuInput[] | BillingUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutSkuInput | BillingCreateOrConnectWithoutSkuInput[]
    upsert?: BillingUpsertWithWhereUniqueWithoutSkuInput | BillingUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: BillingCreateManySkuInputEnvelope
    set?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    disconnect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    delete?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    update?: BillingUpdateWithWhereUniqueWithoutSkuInput | BillingUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: BillingUpdateManyWithWhereWithoutSkuInput | BillingUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: BillingScalarWhereInput | BillingScalarWhereInput[]
  }

  export type InventoryUncheckedUpdateManyWithoutSkuNestedInput = {
    create?: XOR<InventoryCreateWithoutSkuInput, InventoryUncheckedCreateWithoutSkuInput> | InventoryCreateWithoutSkuInput[] | InventoryUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutSkuInput | InventoryCreateOrConnectWithoutSkuInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutSkuInput | InventoryUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: InventoryCreateManySkuInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutSkuInput | InventoryUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutSkuInput | InventoryUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type TransactionUncheckedUpdateManyWithoutSkuNestedInput = {
    create?: XOR<TransactionCreateWithoutSkuInput, TransactionUncheckedCreateWithoutSkuInput> | TransactionCreateWithoutSkuInput[] | TransactionUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: TransactionCreateOrConnectWithoutSkuInput | TransactionCreateOrConnectWithoutSkuInput[]
    upsert?: TransactionUpsertWithWhereUniqueWithoutSkuInput | TransactionUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: TransactionCreateManySkuInputEnvelope
    set?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    disconnect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    delete?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    connect?: TransactionWhereUniqueInput | TransactionWhereUniqueInput[]
    update?: TransactionUpdateWithWhereUniqueWithoutSkuInput | TransactionUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: TransactionUpdateManyWithWhereWithoutSkuInput | TransactionUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
  }

  export type BillingUncheckedUpdateManyWithoutSkuNestedInput = {
    create?: XOR<BillingCreateWithoutSkuInput, BillingUncheckedCreateWithoutSkuInput> | BillingCreateWithoutSkuInput[] | BillingUncheckedCreateWithoutSkuInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutSkuInput | BillingCreateOrConnectWithoutSkuInput[]
    upsert?: BillingUpsertWithWhereUniqueWithoutSkuInput | BillingUpsertWithWhereUniqueWithoutSkuInput[]
    createMany?: BillingCreateManySkuInputEnvelope
    set?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    disconnect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    delete?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    update?: BillingUpdateWithWhereUniqueWithoutSkuInput | BillingUpdateWithWhereUniqueWithoutSkuInput[]
    updateMany?: BillingUpdateManyWithWhereWithoutSkuInput | BillingUpdateManyWithWhereWithoutSkuInput[]
    deleteMany?: BillingScalarWhereInput | BillingScalarWhereInput[]
  }

  export type ShelfCreateNestedManyWithoutRackInput = {
    create?: XOR<ShelfCreateWithoutRackInput, ShelfUncheckedCreateWithoutRackInput> | ShelfCreateWithoutRackInput[] | ShelfUncheckedCreateWithoutRackInput[]
    connectOrCreate?: ShelfCreateOrConnectWithoutRackInput | ShelfCreateOrConnectWithoutRackInput[]
    createMany?: ShelfCreateManyRackInputEnvelope
    connect?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
  }

  export type ShelfUncheckedCreateNestedManyWithoutRackInput = {
    create?: XOR<ShelfCreateWithoutRackInput, ShelfUncheckedCreateWithoutRackInput> | ShelfCreateWithoutRackInput[] | ShelfUncheckedCreateWithoutRackInput[]
    connectOrCreate?: ShelfCreateOrConnectWithoutRackInput | ShelfCreateOrConnectWithoutRackInput[]
    createMany?: ShelfCreateManyRackInputEnvelope
    connect?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
  }

  export type EnumRoomFieldUpdateOperationsInput = {
    set?: $Enums.Room
  }

  export type ShelfUpdateManyWithoutRackNestedInput = {
    create?: XOR<ShelfCreateWithoutRackInput, ShelfUncheckedCreateWithoutRackInput> | ShelfCreateWithoutRackInput[] | ShelfUncheckedCreateWithoutRackInput[]
    connectOrCreate?: ShelfCreateOrConnectWithoutRackInput | ShelfCreateOrConnectWithoutRackInput[]
    upsert?: ShelfUpsertWithWhereUniqueWithoutRackInput | ShelfUpsertWithWhereUniqueWithoutRackInput[]
    createMany?: ShelfCreateManyRackInputEnvelope
    set?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    disconnect?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    delete?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    connect?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    update?: ShelfUpdateWithWhereUniqueWithoutRackInput | ShelfUpdateWithWhereUniqueWithoutRackInput[]
    updateMany?: ShelfUpdateManyWithWhereWithoutRackInput | ShelfUpdateManyWithWhereWithoutRackInput[]
    deleteMany?: ShelfScalarWhereInput | ShelfScalarWhereInput[]
  }

  export type ShelfUncheckedUpdateManyWithoutRackNestedInput = {
    create?: XOR<ShelfCreateWithoutRackInput, ShelfUncheckedCreateWithoutRackInput> | ShelfCreateWithoutRackInput[] | ShelfUncheckedCreateWithoutRackInput[]
    connectOrCreate?: ShelfCreateOrConnectWithoutRackInput | ShelfCreateOrConnectWithoutRackInput[]
    upsert?: ShelfUpsertWithWhereUniqueWithoutRackInput | ShelfUpsertWithWhereUniqueWithoutRackInput[]
    createMany?: ShelfCreateManyRackInputEnvelope
    set?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    disconnect?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    delete?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    connect?: ShelfWhereUniqueInput | ShelfWhereUniqueInput[]
    update?: ShelfUpdateWithWhereUniqueWithoutRackInput | ShelfUpdateWithWhereUniqueWithoutRackInput[]
    updateMany?: ShelfUpdateManyWithWhereWithoutRackInput | ShelfUpdateManyWithWhereWithoutRackInput[]
    deleteMany?: ShelfScalarWhereInput | ShelfScalarWhereInput[]
  }

  export type RackCreateNestedOneWithoutShelvesInput = {
    create?: XOR<RackCreateWithoutShelvesInput, RackUncheckedCreateWithoutShelvesInput>
    connectOrCreate?: RackCreateOrConnectWithoutShelvesInput
    connect?: RackWhereUniqueInput
  }

  export type InventoryCreateNestedManyWithoutShelfInput = {
    create?: XOR<InventoryCreateWithoutShelfInput, InventoryUncheckedCreateWithoutShelfInput> | InventoryCreateWithoutShelfInput[] | InventoryUncheckedCreateWithoutShelfInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutShelfInput | InventoryCreateOrConnectWithoutShelfInput[]
    createMany?: InventoryCreateManyShelfInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type InventoryUncheckedCreateNestedManyWithoutShelfInput = {
    create?: XOR<InventoryCreateWithoutShelfInput, InventoryUncheckedCreateWithoutShelfInput> | InventoryCreateWithoutShelfInput[] | InventoryUncheckedCreateWithoutShelfInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutShelfInput | InventoryCreateOrConnectWithoutShelfInput[]
    createMany?: InventoryCreateManyShelfInputEnvelope
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
  }

  export type EnumLevelFieldUpdateOperationsInput = {
    set?: $Enums.Level
  }

  export type RackUpdateOneRequiredWithoutShelvesNestedInput = {
    create?: XOR<RackCreateWithoutShelvesInput, RackUncheckedCreateWithoutShelvesInput>
    connectOrCreate?: RackCreateOrConnectWithoutShelvesInput
    upsert?: RackUpsertWithoutShelvesInput
    connect?: RackWhereUniqueInput
    update?: XOR<XOR<RackUpdateToOneWithWhereWithoutShelvesInput, RackUpdateWithoutShelvesInput>, RackUncheckedUpdateWithoutShelvesInput>
  }

  export type InventoryUpdateManyWithoutShelfNestedInput = {
    create?: XOR<InventoryCreateWithoutShelfInput, InventoryUncheckedCreateWithoutShelfInput> | InventoryCreateWithoutShelfInput[] | InventoryUncheckedCreateWithoutShelfInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutShelfInput | InventoryCreateOrConnectWithoutShelfInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutShelfInput | InventoryUpsertWithWhereUniqueWithoutShelfInput[]
    createMany?: InventoryCreateManyShelfInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutShelfInput | InventoryUpdateWithWhereUniqueWithoutShelfInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutShelfInput | InventoryUpdateManyWithWhereWithoutShelfInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type InventoryUncheckedUpdateManyWithoutShelfNestedInput = {
    create?: XOR<InventoryCreateWithoutShelfInput, InventoryUncheckedCreateWithoutShelfInput> | InventoryCreateWithoutShelfInput[] | InventoryUncheckedCreateWithoutShelfInput[]
    connectOrCreate?: InventoryCreateOrConnectWithoutShelfInput | InventoryCreateOrConnectWithoutShelfInput[]
    upsert?: InventoryUpsertWithWhereUniqueWithoutShelfInput | InventoryUpsertWithWhereUniqueWithoutShelfInput[]
    createMany?: InventoryCreateManyShelfInputEnvelope
    set?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    disconnect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    delete?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    connect?: InventoryWhereUniqueInput | InventoryWhereUniqueInput[]
    update?: InventoryUpdateWithWhereUniqueWithoutShelfInput | InventoryUpdateWithWhereUniqueWithoutShelfInput[]
    updateMany?: InventoryUpdateManyWithWhereWithoutShelfInput | InventoryUpdateManyWithWhereWithoutShelfInput[]
    deleteMany?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
  }

  export type SKUCreateNestedOneWithoutInventoriesInput = {
    create?: XOR<SKUCreateWithoutInventoriesInput, SKUUncheckedCreateWithoutInventoriesInput>
    connectOrCreate?: SKUCreateOrConnectWithoutInventoriesInput
    connect?: SKUWhereUniqueInput
  }

  export type ShelfCreateNestedOneWithoutInventoriesInput = {
    create?: XOR<ShelfCreateWithoutInventoriesInput, ShelfUncheckedCreateWithoutInventoriesInput>
    connectOrCreate?: ShelfCreateOrConnectWithoutInventoriesInput
    connect?: ShelfWhereUniqueInput
  }

  export type SKUUpdateOneRequiredWithoutInventoriesNestedInput = {
    create?: XOR<SKUCreateWithoutInventoriesInput, SKUUncheckedCreateWithoutInventoriesInput>
    connectOrCreate?: SKUCreateOrConnectWithoutInventoriesInput
    upsert?: SKUUpsertWithoutInventoriesInput
    connect?: SKUWhereUniqueInput
    update?: XOR<XOR<SKUUpdateToOneWithWhereWithoutInventoriesInput, SKUUpdateWithoutInventoriesInput>, SKUUncheckedUpdateWithoutInventoriesInput>
  }

  export type ShelfUpdateOneRequiredWithoutInventoriesNestedInput = {
    create?: XOR<ShelfCreateWithoutInventoriesInput, ShelfUncheckedCreateWithoutInventoriesInput>
    connectOrCreate?: ShelfCreateOrConnectWithoutInventoriesInput
    upsert?: ShelfUpsertWithoutInventoriesInput
    connect?: ShelfWhereUniqueInput
    update?: XOR<XOR<ShelfUpdateToOneWithWhereWithoutInventoriesInput, ShelfUpdateWithoutInventoriesInput>, ShelfUncheckedUpdateWithoutInventoriesInput>
  }

  export type SKUCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<SKUCreateWithoutTransactionsInput, SKUUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: SKUCreateOrConnectWithoutTransactionsInput
    connect?: SKUWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumTxTypeFieldUpdateOperationsInput = {
    set?: $Enums.TxType
  }

  export type SKUUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: XOR<SKUCreateWithoutTransactionsInput, SKUUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: SKUCreateOrConnectWithoutTransactionsInput
    upsert?: SKUUpsertWithoutTransactionsInput
    connect?: SKUWhereUniqueInput
    update?: XOR<XOR<SKUUpdateToOneWithWhereWithoutTransactionsInput, SKUUpdateWithoutTransactionsInput>, SKUUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserUpdateOneWithoutTransactionsNestedInput = {
    create?: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTransactionsInput
    upsert?: UserUpsertWithoutTransactionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTransactionsInput, UserUpdateWithoutTransactionsInput>, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type SKUCreateNestedOneWithoutBillingsInput = {
    create?: XOR<SKUCreateWithoutBillingsInput, SKUUncheckedCreateWithoutBillingsInput>
    connectOrCreate?: SKUCreateOrConnectWithoutBillingsInput
    connect?: SKUWhereUniqueInput
  }

  export type CustomerCreateNestedOneWithoutBillingsInput = {
    create?: XOR<CustomerCreateWithoutBillingsInput, CustomerUncheckedCreateWithoutBillingsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutBillingsInput
    connect?: CustomerWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SKUUpdateOneRequiredWithoutBillingsNestedInput = {
    create?: XOR<SKUCreateWithoutBillingsInput, SKUUncheckedCreateWithoutBillingsInput>
    connectOrCreate?: SKUCreateOrConnectWithoutBillingsInput
    upsert?: SKUUpsertWithoutBillingsInput
    connect?: SKUWhereUniqueInput
    update?: XOR<XOR<SKUUpdateToOneWithWhereWithoutBillingsInput, SKUUpdateWithoutBillingsInput>, SKUUncheckedUpdateWithoutBillingsInput>
  }

  export type CustomerUpdateOneWithoutBillingsNestedInput = {
    create?: XOR<CustomerCreateWithoutBillingsInput, CustomerUncheckedCreateWithoutBillingsInput>
    connectOrCreate?: CustomerCreateOrConnectWithoutBillingsInput
    upsert?: CustomerUpsertWithoutBillingsInput
    disconnect?: CustomerWhereInput | boolean
    delete?: CustomerWhereInput | boolean
    connect?: CustomerWhereUniqueInput
    update?: XOR<XOR<CustomerUpdateToOneWithWhereWithoutBillingsInput, CustomerUpdateWithoutBillingsInput>, CustomerUncheckedUpdateWithoutBillingsInput>
  }

  export type BillingCreateNestedManyWithoutCustomerInput = {
    create?: XOR<BillingCreateWithoutCustomerInput, BillingUncheckedCreateWithoutCustomerInput> | BillingCreateWithoutCustomerInput[] | BillingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutCustomerInput | BillingCreateOrConnectWithoutCustomerInput[]
    createMany?: BillingCreateManyCustomerInputEnvelope
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
  }

  export type BillingUncheckedCreateNestedManyWithoutCustomerInput = {
    create?: XOR<BillingCreateWithoutCustomerInput, BillingUncheckedCreateWithoutCustomerInput> | BillingCreateWithoutCustomerInput[] | BillingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutCustomerInput | BillingCreateOrConnectWithoutCustomerInput[]
    createMany?: BillingCreateManyCustomerInputEnvelope
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
  }

  export type BillingUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<BillingCreateWithoutCustomerInput, BillingUncheckedCreateWithoutCustomerInput> | BillingCreateWithoutCustomerInput[] | BillingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutCustomerInput | BillingCreateOrConnectWithoutCustomerInput[]
    upsert?: BillingUpsertWithWhereUniqueWithoutCustomerInput | BillingUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: BillingCreateManyCustomerInputEnvelope
    set?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    disconnect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    delete?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    update?: BillingUpdateWithWhereUniqueWithoutCustomerInput | BillingUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: BillingUpdateManyWithWhereWithoutCustomerInput | BillingUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: BillingScalarWhereInput | BillingScalarWhereInput[]
  }

  export type BillingUncheckedUpdateManyWithoutCustomerNestedInput = {
    create?: XOR<BillingCreateWithoutCustomerInput, BillingUncheckedCreateWithoutCustomerInput> | BillingCreateWithoutCustomerInput[] | BillingUncheckedCreateWithoutCustomerInput[]
    connectOrCreate?: BillingCreateOrConnectWithoutCustomerInput | BillingCreateOrConnectWithoutCustomerInput[]
    upsert?: BillingUpsertWithWhereUniqueWithoutCustomerInput | BillingUpsertWithWhereUniqueWithoutCustomerInput[]
    createMany?: BillingCreateManyCustomerInputEnvelope
    set?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    disconnect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    delete?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    connect?: BillingWhereUniqueInput | BillingWhereUniqueInput[]
    update?: BillingUpdateWithWhereUniqueWithoutCustomerInput | BillingUpdateWithWhereUniqueWithoutCustomerInput[]
    updateMany?: BillingUpdateManyWithWhereWithoutCustomerInput | BillingUpdateManyWithWhereWithoutCustomerInput[]
    deleteMany?: BillingScalarWhereInput | BillingScalarWhereInput[]
  }

  export type PermissionCreateNestedManyWithoutModuleInput = {
    create?: XOR<PermissionCreateWithoutModuleInput, PermissionUncheckedCreateWithoutModuleInput> | PermissionCreateWithoutModuleInput[] | PermissionUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutModuleInput | PermissionCreateOrConnectWithoutModuleInput[]
    createMany?: PermissionCreateManyModuleInputEnvelope
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
  }

  export type PermissionUncheckedCreateNestedManyWithoutModuleInput = {
    create?: XOR<PermissionCreateWithoutModuleInput, PermissionUncheckedCreateWithoutModuleInput> | PermissionCreateWithoutModuleInput[] | PermissionUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutModuleInput | PermissionCreateOrConnectWithoutModuleInput[]
    createMany?: PermissionCreateManyModuleInputEnvelope
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
  }

  export type PermissionUpdateManyWithoutModuleNestedInput = {
    create?: XOR<PermissionCreateWithoutModuleInput, PermissionUncheckedCreateWithoutModuleInput> | PermissionCreateWithoutModuleInput[] | PermissionUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutModuleInput | PermissionCreateOrConnectWithoutModuleInput[]
    upsert?: PermissionUpsertWithWhereUniqueWithoutModuleInput | PermissionUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: PermissionCreateManyModuleInputEnvelope
    set?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    disconnect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    delete?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    update?: PermissionUpdateWithWhereUniqueWithoutModuleInput | PermissionUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: PermissionUpdateManyWithWhereWithoutModuleInput | PermissionUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: PermissionScalarWhereInput | PermissionScalarWhereInput[]
  }

  export type PermissionUncheckedUpdateManyWithoutModuleNestedInput = {
    create?: XOR<PermissionCreateWithoutModuleInput, PermissionUncheckedCreateWithoutModuleInput> | PermissionCreateWithoutModuleInput[] | PermissionUncheckedCreateWithoutModuleInput[]
    connectOrCreate?: PermissionCreateOrConnectWithoutModuleInput | PermissionCreateOrConnectWithoutModuleInput[]
    upsert?: PermissionUpsertWithWhereUniqueWithoutModuleInput | PermissionUpsertWithWhereUniqueWithoutModuleInput[]
    createMany?: PermissionCreateManyModuleInputEnvelope
    set?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    disconnect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    delete?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    connect?: PermissionWhereUniqueInput | PermissionWhereUniqueInput[]
    update?: PermissionUpdateWithWhereUniqueWithoutModuleInput | PermissionUpdateWithWhereUniqueWithoutModuleInput[]
    updateMany?: PermissionUpdateManyWithWhereWithoutModuleInput | PermissionUpdateManyWithWhereWithoutModuleInput[]
    deleteMany?: PermissionScalarWhereInput | PermissionScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutPermissionsInput
    connect?: RoleWhereUniqueInput
  }

  export type ModuleCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<ModuleCreateWithoutPermissionsInput, ModuleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutPermissionsInput
    connect?: ModuleWhereUniqueInput
  }

  export type RoleUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutPermissionsInput
    upsert?: RoleUpsertWithoutPermissionsInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutPermissionsInput, RoleUpdateWithoutPermissionsInput>, RoleUncheckedUpdateWithoutPermissionsInput>
  }

  export type ModuleUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<ModuleCreateWithoutPermissionsInput, ModuleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: ModuleCreateOrConnectWithoutPermissionsInput
    upsert?: ModuleUpsertWithoutPermissionsInput
    connect?: ModuleWhereUniqueInput
    update?: XOR<XOR<ModuleUpdateToOneWithWhereWithoutPermissionsInput, ModuleUpdateWithoutPermissionsInput>, ModuleUncheckedUpdateWithoutPermissionsInput>
  }

  export type EnumLogUserFieldUpdateOperationsInput = {
    set?: $Enums.LogUser
  }

  export type EnumLogActionFieldUpdateOperationsInput = {
    set?: $Enums.LogAction
  }

  export type EnumLogStatusFieldUpdateOperationsInput = {
    set?: $Enums.LogStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumRoomFilter<$PrismaModel = never> = {
    equals?: $Enums.Room | EnumRoomFieldRefInput<$PrismaModel>
    in?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    notIn?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomFilter<$PrismaModel> | $Enums.Room
  }

  export type NestedEnumRoomWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Room | EnumRoomFieldRefInput<$PrismaModel>
    in?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    notIn?: $Enums.Room[] | ListEnumRoomFieldRefInput<$PrismaModel>
    not?: NestedEnumRoomWithAggregatesFilter<$PrismaModel> | $Enums.Room
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoomFilter<$PrismaModel>
    _max?: NestedEnumRoomFilter<$PrismaModel>
  }

  export type NestedEnumLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | EnumLevelFieldRefInput<$PrismaModel>
    in?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLevelFilter<$PrismaModel> | $Enums.Level
  }

  export type NestedEnumLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Level | EnumLevelFieldRefInput<$PrismaModel>
    in?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.Level[] | ListEnumLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumLevelWithAggregatesFilter<$PrismaModel> | $Enums.Level
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLevelFilter<$PrismaModel>
    _max?: NestedEnumLevelFilter<$PrismaModel>
  }

  export type NestedEnumTxTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TxType | EnumTxTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTxTypeFilter<$PrismaModel> | $Enums.TxType
  }

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumTxTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TxType | EnumTxTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TxType[] | ListEnumTxTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTxTypeWithAggregatesFilter<$PrismaModel> | $Enums.TxType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTxTypeFilter<$PrismaModel>
    _max?: NestedEnumTxTypeFilter<$PrismaModel>
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedEnumLogUserFilter<$PrismaModel = never> = {
    equals?: $Enums.LogUser | EnumLogUserFieldRefInput<$PrismaModel>
    in?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    not?: NestedEnumLogUserFilter<$PrismaModel> | $Enums.LogUser
  }

  export type NestedEnumLogActionFilter<$PrismaModel = never> = {
    equals?: $Enums.LogAction | EnumLogActionFieldRefInput<$PrismaModel>
    in?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLogActionFilter<$PrismaModel> | $Enums.LogAction
  }

  export type NestedEnumLogStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LogStatus | EnumLogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLogStatusFilter<$PrismaModel> | $Enums.LogStatus
  }

  export type NestedEnumLogUserWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogUser | EnumLogUserFieldRefInput<$PrismaModel>
    in?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogUser[] | ListEnumLogUserFieldRefInput<$PrismaModel>
    not?: NestedEnumLogUserWithAggregatesFilter<$PrismaModel> | $Enums.LogUser
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogUserFilter<$PrismaModel>
    _max?: NestedEnumLogUserFilter<$PrismaModel>
  }

  export type NestedEnumLogActionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogAction | EnumLogActionFieldRefInput<$PrismaModel>
    in?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogAction[] | ListEnumLogActionFieldRefInput<$PrismaModel>
    not?: NestedEnumLogActionWithAggregatesFilter<$PrismaModel> | $Enums.LogAction
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogActionFilter<$PrismaModel>
    _max?: NestedEnumLogActionFilter<$PrismaModel>
  }

  export type NestedEnumLogStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LogStatus | EnumLogStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LogStatus[] | ListEnumLogStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLogStatusWithAggregatesFilter<$PrismaModel> | $Enums.LogStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLogStatusFilter<$PrismaModel>
    _max?: NestedEnumLogStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type RoleCreateWithoutUsersInput = {
    id?: string
    name: string
    permissions?: PermissionCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    permissions?: PermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutUsersInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
  }

  export type TransactionCreateWithoutUserInput = {
    id?: string
    type: $Enums.TxType
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
    sku: SKUCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateWithoutUserInput = {
    id?: string
    type: $Enums.TxType
    skuId: string
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
  }

  export type TransactionCreateOrConnectWithoutUserInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionCreateManyUserInputEnvelope = {
    data: TransactionCreateManyUserInput | TransactionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RoleUpsertWithoutUsersInput = {
    update: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUsersInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: PermissionUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    permissions?: PermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type TransactionUpsertWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
    create: XOR<TransactionCreateWithoutUserInput, TransactionUncheckedCreateWithoutUserInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutUserInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutUserInput, TransactionUncheckedUpdateWithoutUserInput>
  }

  export type TransactionUpdateManyWithWhereWithoutUserInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutUserInput>
  }

  export type TransactionScalarWhereInput = {
    AND?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    OR?: TransactionScalarWhereInput[]
    NOT?: TransactionScalarWhereInput | TransactionScalarWhereInput[]
    id?: UuidFilter<"Transaction"> | string
    type?: EnumTxTypeFilter<"Transaction"> | $Enums.TxType
    skuId?: UuidFilter<"Transaction"> | string
    quantity?: IntFilter<"Transaction"> | number
    rackLocation?: StringNullableFilter<"Transaction"> | string | null
    status?: StringFilter<"Transaction"> | string
    timestamp?: DateTimeFilter<"Transaction"> | Date | string
    userId?: UuidNullableFilter<"Transaction"> | string | null
    barcodeValue?: StringNullableFilter<"Transaction"> | string | null
    barcodeNumber?: StringNullableFilter<"Transaction"> | string | null
    barcodeImageData?: StringNullableFilter<"Transaction"> | string | null
  }

  export type UserCreateWithoutRoleInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    transactions?: TransactionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRoleInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRoleInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput>
  }

  export type UserCreateManyRoleInputEnvelope = {
    data: UserCreateManyRoleInput | UserCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type PermissionCreateWithoutRoleInput = {
    id?: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    module: ModuleCreateNestedOneWithoutPermissionsInput
  }

  export type PermissionUncheckedCreateWithoutRoleInput = {
    id?: string
    moduleId: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }

  export type PermissionCreateOrConnectWithoutRoleInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutRoleInput, PermissionUncheckedCreateWithoutRoleInput>
  }

  export type PermissionCreateManyRoleInputEnvelope = {
    data: PermissionCreateManyRoleInput | PermissionCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutRoleInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutRoleInput, UserUncheckedUpdateWithoutRoleInput>
    create: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput>
  }

  export type UserUpdateWithWhereUniqueWithoutRoleInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutRoleInput, UserUncheckedUpdateWithoutRoleInput>
  }

  export type UserUpdateManyWithWhereWithoutRoleInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutRoleInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: UuidFilter<"User"> | string
    name?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    roleId?: UuidFilter<"User"> | string
    createdAt?: DateTimeFilter<"User"> | Date | string
  }

  export type PermissionUpsertWithWhereUniqueWithoutRoleInput = {
    where: PermissionWhereUniqueInput
    update: XOR<PermissionUpdateWithoutRoleInput, PermissionUncheckedUpdateWithoutRoleInput>
    create: XOR<PermissionCreateWithoutRoleInput, PermissionUncheckedCreateWithoutRoleInput>
  }

  export type PermissionUpdateWithWhereUniqueWithoutRoleInput = {
    where: PermissionWhereUniqueInput
    data: XOR<PermissionUpdateWithoutRoleInput, PermissionUncheckedUpdateWithoutRoleInput>
  }

  export type PermissionUpdateManyWithWhereWithoutRoleInput = {
    where: PermissionScalarWhereInput
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyWithoutRoleInput>
  }

  export type PermissionScalarWhereInput = {
    AND?: PermissionScalarWhereInput | PermissionScalarWhereInput[]
    OR?: PermissionScalarWhereInput[]
    NOT?: PermissionScalarWhereInput | PermissionScalarWhereInput[]
    id?: UuidFilter<"Permission"> | string
    roleId?: UuidFilter<"Permission"> | string
    moduleId?: UuidFilter<"Permission"> | string
    canView?: BoolFilter<"Permission"> | boolean
    canCreate?: BoolFilter<"Permission"> | boolean
    canEdit?: BoolFilter<"Permission"> | boolean
    canDelete?: BoolFilter<"Permission"> | boolean
  }

  export type SubCategoryCreateWithoutCategoryInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    skus?: SKUCreateNestedManyWithoutSubCategoryInput
  }

  export type SubCategoryUncheckedCreateWithoutCategoryInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    skus?: SKUUncheckedCreateNestedManyWithoutSubCategoryInput
  }

  export type SubCategoryCreateOrConnectWithoutCategoryInput = {
    where: SubCategoryWhereUniqueInput
    create: XOR<SubCategoryCreateWithoutCategoryInput, SubCategoryUncheckedCreateWithoutCategoryInput>
  }

  export type SubCategoryCreateManyCategoryInputEnvelope = {
    data: SubCategoryCreateManyCategoryInput | SubCategoryCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type SKUCreateWithoutCategoryInput = {
    id?: string
    skuCode: string
    productName: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    subCategory: SubCategoryCreateNestedOneWithoutSkusInput
    inventories?: InventoryCreateNestedManyWithoutSkuInput
    transactions?: TransactionCreateNestedManyWithoutSkuInput
    billings?: BillingCreateNestedManyWithoutSkuInput
  }

  export type SKUUncheckedCreateWithoutCategoryInput = {
    id?: string
    skuCode: string
    productName: string
    subCategoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    inventories?: InventoryUncheckedCreateNestedManyWithoutSkuInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutSkuInput
    billings?: BillingUncheckedCreateNestedManyWithoutSkuInput
  }

  export type SKUCreateOrConnectWithoutCategoryInput = {
    where: SKUWhereUniqueInput
    create: XOR<SKUCreateWithoutCategoryInput, SKUUncheckedCreateWithoutCategoryInput>
  }

  export type SKUCreateManyCategoryInputEnvelope = {
    data: SKUCreateManyCategoryInput | SKUCreateManyCategoryInput[]
    skipDuplicates?: boolean
  }

  export type SubCategoryUpsertWithWhereUniqueWithoutCategoryInput = {
    where: SubCategoryWhereUniqueInput
    update: XOR<SubCategoryUpdateWithoutCategoryInput, SubCategoryUncheckedUpdateWithoutCategoryInput>
    create: XOR<SubCategoryCreateWithoutCategoryInput, SubCategoryUncheckedCreateWithoutCategoryInput>
  }

  export type SubCategoryUpdateWithWhereUniqueWithoutCategoryInput = {
    where: SubCategoryWhereUniqueInput
    data: XOR<SubCategoryUpdateWithoutCategoryInput, SubCategoryUncheckedUpdateWithoutCategoryInput>
  }

  export type SubCategoryUpdateManyWithWhereWithoutCategoryInput = {
    where: SubCategoryScalarWhereInput
    data: XOR<SubCategoryUpdateManyMutationInput, SubCategoryUncheckedUpdateManyWithoutCategoryInput>
  }

  export type SubCategoryScalarWhereInput = {
    AND?: SubCategoryScalarWhereInput | SubCategoryScalarWhereInput[]
    OR?: SubCategoryScalarWhereInput[]
    NOT?: SubCategoryScalarWhereInput | SubCategoryScalarWhereInput[]
    id?: UuidFilter<"SubCategory"> | string
    name?: StringFilter<"SubCategory"> | string
    isActive?: BoolFilter<"SubCategory"> | boolean
    categoryId?: UuidFilter<"SubCategory"> | string
    createdAt?: DateTimeFilter<"SubCategory"> | Date | string
  }

  export type SKUUpsertWithWhereUniqueWithoutCategoryInput = {
    where: SKUWhereUniqueInput
    update: XOR<SKUUpdateWithoutCategoryInput, SKUUncheckedUpdateWithoutCategoryInput>
    create: XOR<SKUCreateWithoutCategoryInput, SKUUncheckedCreateWithoutCategoryInput>
  }

  export type SKUUpdateWithWhereUniqueWithoutCategoryInput = {
    where: SKUWhereUniqueInput
    data: XOR<SKUUpdateWithoutCategoryInput, SKUUncheckedUpdateWithoutCategoryInput>
  }

  export type SKUUpdateManyWithWhereWithoutCategoryInput = {
    where: SKUScalarWhereInput
    data: XOR<SKUUpdateManyMutationInput, SKUUncheckedUpdateManyWithoutCategoryInput>
  }

  export type SKUScalarWhereInput = {
    AND?: SKUScalarWhereInput | SKUScalarWhereInput[]
    OR?: SKUScalarWhereInput[]
    NOT?: SKUScalarWhereInput | SKUScalarWhereInput[]
    id?: UuidFilter<"SKU"> | string
    skuCode?: StringFilter<"SKU"> | string
    productName?: StringFilter<"SKU"> | string
    categoryId?: UuidFilter<"SKU"> | string
    subCategoryId?: UuidFilter<"SKU"> | string
    length?: FloatFilter<"SKU"> | number
    width?: FloatFilter<"SKU"> | number
    height?: FloatFilter<"SKU"> | number
    weight?: FloatFilter<"SKU"> | number
    barcode?: StringNullableFilter<"SKU"> | string | null
    barcodeFormat?: StringFilter<"SKU"> | string
    stock?: IntFilter<"SKU"> | number
    rackLocation?: StringNullableFilter<"SKU"> | string | null
    createdAt?: DateTimeFilter<"SKU"> | Date | string
  }

  export type CategoryCreateWithoutSubcategoriesInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    skus?: SKUCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutSubcategoriesInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    skus?: SKUUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutSubcategoriesInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutSubcategoriesInput, CategoryUncheckedCreateWithoutSubcategoriesInput>
  }

  export type SKUCreateWithoutSubCategoryInput = {
    id?: string
    skuCode: string
    productName: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutSkusInput
    inventories?: InventoryCreateNestedManyWithoutSkuInput
    transactions?: TransactionCreateNestedManyWithoutSkuInput
    billings?: BillingCreateNestedManyWithoutSkuInput
  }

  export type SKUUncheckedCreateWithoutSubCategoryInput = {
    id?: string
    skuCode: string
    productName: string
    categoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    inventories?: InventoryUncheckedCreateNestedManyWithoutSkuInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutSkuInput
    billings?: BillingUncheckedCreateNestedManyWithoutSkuInput
  }

  export type SKUCreateOrConnectWithoutSubCategoryInput = {
    where: SKUWhereUniqueInput
    create: XOR<SKUCreateWithoutSubCategoryInput, SKUUncheckedCreateWithoutSubCategoryInput>
  }

  export type SKUCreateManySubCategoryInputEnvelope = {
    data: SKUCreateManySubCategoryInput | SKUCreateManySubCategoryInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutSubcategoriesInput = {
    update: XOR<CategoryUpdateWithoutSubcategoriesInput, CategoryUncheckedUpdateWithoutSubcategoriesInput>
    create: XOR<CategoryCreateWithoutSubcategoriesInput, CategoryUncheckedCreateWithoutSubcategoriesInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutSubcategoriesInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutSubcategoriesInput, CategoryUncheckedUpdateWithoutSubcategoriesInput>
  }

  export type CategoryUpdateWithoutSubcategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: SKUUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutSubcategoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: SKUUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type SKUUpsertWithWhereUniqueWithoutSubCategoryInput = {
    where: SKUWhereUniqueInput
    update: XOR<SKUUpdateWithoutSubCategoryInput, SKUUncheckedUpdateWithoutSubCategoryInput>
    create: XOR<SKUCreateWithoutSubCategoryInput, SKUUncheckedCreateWithoutSubCategoryInput>
  }

  export type SKUUpdateWithWhereUniqueWithoutSubCategoryInput = {
    where: SKUWhereUniqueInput
    data: XOR<SKUUpdateWithoutSubCategoryInput, SKUUncheckedUpdateWithoutSubCategoryInput>
  }

  export type SKUUpdateManyWithWhereWithoutSubCategoryInput = {
    where: SKUScalarWhereInput
    data: XOR<SKUUpdateManyMutationInput, SKUUncheckedUpdateManyWithoutSubCategoryInput>
  }

  export type CategoryCreateWithoutSkusInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    subcategories?: SubCategoryCreateNestedManyWithoutCategoryInput
  }

  export type CategoryUncheckedCreateWithoutSkusInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    subcategories?: SubCategoryUncheckedCreateNestedManyWithoutCategoryInput
  }

  export type CategoryCreateOrConnectWithoutSkusInput = {
    where: CategoryWhereUniqueInput
    create: XOR<CategoryCreateWithoutSkusInput, CategoryUncheckedCreateWithoutSkusInput>
  }

  export type SubCategoryCreateWithoutSkusInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutSubcategoriesInput
  }

  export type SubCategoryUncheckedCreateWithoutSkusInput = {
    id?: string
    name: string
    isActive?: boolean
    categoryId: string
    createdAt?: Date | string
  }

  export type SubCategoryCreateOrConnectWithoutSkusInput = {
    where: SubCategoryWhereUniqueInput
    create: XOR<SubCategoryCreateWithoutSkusInput, SubCategoryUncheckedCreateWithoutSkusInput>
  }

  export type InventoryCreateWithoutSkuInput = {
    id?: string
    quantity: number
    qrCode?: string | null
    shelf: ShelfCreateNestedOneWithoutInventoriesInput
  }

  export type InventoryUncheckedCreateWithoutSkuInput = {
    id?: string
    shelfId: string
    quantity: number
    qrCode?: string | null
  }

  export type InventoryCreateOrConnectWithoutSkuInput = {
    where: InventoryWhereUniqueInput
    create: XOR<InventoryCreateWithoutSkuInput, InventoryUncheckedCreateWithoutSkuInput>
  }

  export type InventoryCreateManySkuInputEnvelope = {
    data: InventoryCreateManySkuInput | InventoryCreateManySkuInput[]
    skipDuplicates?: boolean
  }

  export type TransactionCreateWithoutSkuInput = {
    id?: string
    type: $Enums.TxType
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
    user?: UserCreateNestedOneWithoutTransactionsInput
  }

  export type TransactionUncheckedCreateWithoutSkuInput = {
    id?: string
    type: $Enums.TxType
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    userId?: string | null
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
  }

  export type TransactionCreateOrConnectWithoutSkuInput = {
    where: TransactionWhereUniqueInput
    create: XOR<TransactionCreateWithoutSkuInput, TransactionUncheckedCreateWithoutSkuInput>
  }

  export type TransactionCreateManySkuInputEnvelope = {
    data: TransactionCreateManySkuInput | TransactionCreateManySkuInput[]
    skipDuplicates?: boolean
  }

  export type BillingCreateWithoutSkuInput = {
    id?: string
    invoiceId: string
    orderId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customer?: CustomerCreateNestedOneWithoutBillingsInput
  }

  export type BillingUncheckedCreateWithoutSkuInput = {
    id?: string
    invoiceId: string
    orderId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerId?: string | null
  }

  export type BillingCreateOrConnectWithoutSkuInput = {
    where: BillingWhereUniqueInput
    create: XOR<BillingCreateWithoutSkuInput, BillingUncheckedCreateWithoutSkuInput>
  }

  export type BillingCreateManySkuInputEnvelope = {
    data: BillingCreateManySkuInput | BillingCreateManySkuInput[]
    skipDuplicates?: boolean
  }

  export type CategoryUpsertWithoutSkusInput = {
    update: XOR<CategoryUpdateWithoutSkusInput, CategoryUncheckedUpdateWithoutSkusInput>
    create: XOR<CategoryCreateWithoutSkusInput, CategoryUncheckedCreateWithoutSkusInput>
    where?: CategoryWhereInput
  }

  export type CategoryUpdateToOneWithWhereWithoutSkusInput = {
    where?: CategoryWhereInput
    data: XOR<CategoryUpdateWithoutSkusInput, CategoryUncheckedUpdateWithoutSkusInput>
  }

  export type CategoryUpdateWithoutSkusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategories?: SubCategoryUpdateManyWithoutCategoryNestedInput
  }

  export type CategoryUncheckedUpdateWithoutSkusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subcategories?: SubCategoryUncheckedUpdateManyWithoutCategoryNestedInput
  }

  export type SubCategoryUpsertWithoutSkusInput = {
    update: XOR<SubCategoryUpdateWithoutSkusInput, SubCategoryUncheckedUpdateWithoutSkusInput>
    create: XOR<SubCategoryCreateWithoutSkusInput, SubCategoryUncheckedCreateWithoutSkusInput>
    where?: SubCategoryWhereInput
  }

  export type SubCategoryUpdateToOneWithWhereWithoutSkusInput = {
    where?: SubCategoryWhereInput
    data: XOR<SubCategoryUpdateWithoutSkusInput, SubCategoryUncheckedUpdateWithoutSkusInput>
  }

  export type SubCategoryUpdateWithoutSkusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutSubcategoriesNestedInput
  }

  export type SubCategoryUncheckedUpdateWithoutSkusInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    categoryId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryUpsertWithWhereUniqueWithoutSkuInput = {
    where: InventoryWhereUniqueInput
    update: XOR<InventoryUpdateWithoutSkuInput, InventoryUncheckedUpdateWithoutSkuInput>
    create: XOR<InventoryCreateWithoutSkuInput, InventoryUncheckedCreateWithoutSkuInput>
  }

  export type InventoryUpdateWithWhereUniqueWithoutSkuInput = {
    where: InventoryWhereUniqueInput
    data: XOR<InventoryUpdateWithoutSkuInput, InventoryUncheckedUpdateWithoutSkuInput>
  }

  export type InventoryUpdateManyWithWhereWithoutSkuInput = {
    where: InventoryScalarWhereInput
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyWithoutSkuInput>
  }

  export type InventoryScalarWhereInput = {
    AND?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
    OR?: InventoryScalarWhereInput[]
    NOT?: InventoryScalarWhereInput | InventoryScalarWhereInput[]
    id?: UuidFilter<"Inventory"> | string
    skuId?: UuidFilter<"Inventory"> | string
    shelfId?: UuidFilter<"Inventory"> | string
    quantity?: IntFilter<"Inventory"> | number
    qrCode?: StringNullableFilter<"Inventory"> | string | null
  }

  export type TransactionUpsertWithWhereUniqueWithoutSkuInput = {
    where: TransactionWhereUniqueInput
    update: XOR<TransactionUpdateWithoutSkuInput, TransactionUncheckedUpdateWithoutSkuInput>
    create: XOR<TransactionCreateWithoutSkuInput, TransactionUncheckedCreateWithoutSkuInput>
  }

  export type TransactionUpdateWithWhereUniqueWithoutSkuInput = {
    where: TransactionWhereUniqueInput
    data: XOR<TransactionUpdateWithoutSkuInput, TransactionUncheckedUpdateWithoutSkuInput>
  }

  export type TransactionUpdateManyWithWhereWithoutSkuInput = {
    where: TransactionScalarWhereInput
    data: XOR<TransactionUpdateManyMutationInput, TransactionUncheckedUpdateManyWithoutSkuInput>
  }

  export type BillingUpsertWithWhereUniqueWithoutSkuInput = {
    where: BillingWhereUniqueInput
    update: XOR<BillingUpdateWithoutSkuInput, BillingUncheckedUpdateWithoutSkuInput>
    create: XOR<BillingCreateWithoutSkuInput, BillingUncheckedCreateWithoutSkuInput>
  }

  export type BillingUpdateWithWhereUniqueWithoutSkuInput = {
    where: BillingWhereUniqueInput
    data: XOR<BillingUpdateWithoutSkuInput, BillingUncheckedUpdateWithoutSkuInput>
  }

  export type BillingUpdateManyWithWhereWithoutSkuInput = {
    where: BillingScalarWhereInput
    data: XOR<BillingUpdateManyMutationInput, BillingUncheckedUpdateManyWithoutSkuInput>
  }

  export type BillingScalarWhereInput = {
    AND?: BillingScalarWhereInput | BillingScalarWhereInput[]
    OR?: BillingScalarWhereInput[]
    NOT?: BillingScalarWhereInput | BillingScalarWhereInput[]
    id?: UuidFilter<"Billing"> | string
    invoiceId?: StringFilter<"Billing"> | string
    orderId?: StringFilter<"Billing"> | string
    skuId?: UuidFilter<"Billing"> | string
    productName?: StringFilter<"Billing"> | string
    rackHistory?: StringFilter<"Billing"> | string
    duration?: IntFilter<"Billing"> | number
    weightCharges?: FloatFilter<"Billing"> | number
    rackCharges?: FloatFilter<"Billing"> | number
    amount?: FloatFilter<"Billing"> | number
    status?: StringFilter<"Billing"> | string
    date?: StringFilter<"Billing"> | string
    gstPercent?: FloatNullableFilter<"Billing"> | number | null
    companyName?: StringNullableFilter<"Billing"> | string | null
    companyGst?: StringNullableFilter<"Billing"> | string | null
    companyAddr?: StringNullableFilter<"Billing"> | string | null
    companyEmail?: StringNullableFilter<"Billing"> | string | null
    companyPhone?: StringNullableFilter<"Billing"> | string | null
    customerName?: StringNullableFilter<"Billing"> | string | null
    customerGst?: StringNullableFilter<"Billing"> | string | null
    customerAddr?: StringNullableFilter<"Billing"> | string | null
    customerEmail?: StringNullableFilter<"Billing"> | string | null
    customerPhone?: StringNullableFilter<"Billing"> | string | null
    customerId?: UuidNullableFilter<"Billing"> | string | null
  }

  export type ShelfCreateWithoutRackInput = {
    id?: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
    inventories?: InventoryCreateNestedManyWithoutShelfInput
  }

  export type ShelfUncheckedCreateWithoutRackInput = {
    id?: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
    inventories?: InventoryUncheckedCreateNestedManyWithoutShelfInput
  }

  export type ShelfCreateOrConnectWithoutRackInput = {
    where: ShelfWhereUniqueInput
    create: XOR<ShelfCreateWithoutRackInput, ShelfUncheckedCreateWithoutRackInput>
  }

  export type ShelfCreateManyRackInputEnvelope = {
    data: ShelfCreateManyRackInput | ShelfCreateManyRackInput[]
    skipDuplicates?: boolean
  }

  export type ShelfUpsertWithWhereUniqueWithoutRackInput = {
    where: ShelfWhereUniqueInput
    update: XOR<ShelfUpdateWithoutRackInput, ShelfUncheckedUpdateWithoutRackInput>
    create: XOR<ShelfCreateWithoutRackInput, ShelfUncheckedCreateWithoutRackInput>
  }

  export type ShelfUpdateWithWhereUniqueWithoutRackInput = {
    where: ShelfWhereUniqueInput
    data: XOR<ShelfUpdateWithoutRackInput, ShelfUncheckedUpdateWithoutRackInput>
  }

  export type ShelfUpdateManyWithWhereWithoutRackInput = {
    where: ShelfScalarWhereInput
    data: XOR<ShelfUpdateManyMutationInput, ShelfUncheckedUpdateManyWithoutRackInput>
  }

  export type ShelfScalarWhereInput = {
    AND?: ShelfScalarWhereInput | ShelfScalarWhereInput[]
    OR?: ShelfScalarWhereInput[]
    NOT?: ShelfScalarWhereInput | ShelfScalarWhereInput[]
    id?: UuidFilter<"Shelf"> | string
    rackId?: UuidFilter<"Shelf"> | string
    level?: EnumLevelFilter<"Shelf"> | $Enums.Level
    maxVolume?: FloatFilter<"Shelf"> | number
    maxWeight?: FloatFilter<"Shelf"> | number
    usedVolume?: FloatFilter<"Shelf"> | number
    usedWeight?: FloatFilter<"Shelf"> | number
  }

  export type RackCreateWithoutShelvesInput = {
    id?: string
    name: string
    room: $Enums.Room
  }

  export type RackUncheckedCreateWithoutShelvesInput = {
    id?: string
    name: string
    room: $Enums.Room
  }

  export type RackCreateOrConnectWithoutShelvesInput = {
    where: RackWhereUniqueInput
    create: XOR<RackCreateWithoutShelvesInput, RackUncheckedCreateWithoutShelvesInput>
  }

  export type InventoryCreateWithoutShelfInput = {
    id?: string
    quantity: number
    qrCode?: string | null
    sku: SKUCreateNestedOneWithoutInventoriesInput
  }

  export type InventoryUncheckedCreateWithoutShelfInput = {
    id?: string
    skuId: string
    quantity: number
    qrCode?: string | null
  }

  export type InventoryCreateOrConnectWithoutShelfInput = {
    where: InventoryWhereUniqueInput
    create: XOR<InventoryCreateWithoutShelfInput, InventoryUncheckedCreateWithoutShelfInput>
  }

  export type InventoryCreateManyShelfInputEnvelope = {
    data: InventoryCreateManyShelfInput | InventoryCreateManyShelfInput[]
    skipDuplicates?: boolean
  }

  export type RackUpsertWithoutShelvesInput = {
    update: XOR<RackUpdateWithoutShelvesInput, RackUncheckedUpdateWithoutShelvesInput>
    create: XOR<RackCreateWithoutShelvesInput, RackUncheckedCreateWithoutShelvesInput>
    where?: RackWhereInput
  }

  export type RackUpdateToOneWithWhereWithoutShelvesInput = {
    where?: RackWhereInput
    data: XOR<RackUpdateWithoutShelvesInput, RackUncheckedUpdateWithoutShelvesInput>
  }

  export type RackUpdateWithoutShelvesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    room?: EnumRoomFieldUpdateOperationsInput | $Enums.Room
  }

  export type RackUncheckedUpdateWithoutShelvesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    room?: EnumRoomFieldUpdateOperationsInput | $Enums.Room
  }

  export type InventoryUpsertWithWhereUniqueWithoutShelfInput = {
    where: InventoryWhereUniqueInput
    update: XOR<InventoryUpdateWithoutShelfInput, InventoryUncheckedUpdateWithoutShelfInput>
    create: XOR<InventoryCreateWithoutShelfInput, InventoryUncheckedCreateWithoutShelfInput>
  }

  export type InventoryUpdateWithWhereUniqueWithoutShelfInput = {
    where: InventoryWhereUniqueInput
    data: XOR<InventoryUpdateWithoutShelfInput, InventoryUncheckedUpdateWithoutShelfInput>
  }

  export type InventoryUpdateManyWithWhereWithoutShelfInput = {
    where: InventoryScalarWhereInput
    data: XOR<InventoryUpdateManyMutationInput, InventoryUncheckedUpdateManyWithoutShelfInput>
  }

  export type SKUCreateWithoutInventoriesInput = {
    id?: string
    skuCode: string
    productName: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutSkusInput
    subCategory: SubCategoryCreateNestedOneWithoutSkusInput
    transactions?: TransactionCreateNestedManyWithoutSkuInput
    billings?: BillingCreateNestedManyWithoutSkuInput
  }

  export type SKUUncheckedCreateWithoutInventoriesInput = {
    id?: string
    skuCode: string
    productName: string
    categoryId: string
    subCategoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    transactions?: TransactionUncheckedCreateNestedManyWithoutSkuInput
    billings?: BillingUncheckedCreateNestedManyWithoutSkuInput
  }

  export type SKUCreateOrConnectWithoutInventoriesInput = {
    where: SKUWhereUniqueInput
    create: XOR<SKUCreateWithoutInventoriesInput, SKUUncheckedCreateWithoutInventoriesInput>
  }

  export type ShelfCreateWithoutInventoriesInput = {
    id?: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
    rack: RackCreateNestedOneWithoutShelvesInput
  }

  export type ShelfUncheckedCreateWithoutInventoriesInput = {
    id?: string
    rackId: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
  }

  export type ShelfCreateOrConnectWithoutInventoriesInput = {
    where: ShelfWhereUniqueInput
    create: XOR<ShelfCreateWithoutInventoriesInput, ShelfUncheckedCreateWithoutInventoriesInput>
  }

  export type SKUUpsertWithoutInventoriesInput = {
    update: XOR<SKUUpdateWithoutInventoriesInput, SKUUncheckedUpdateWithoutInventoriesInput>
    create: XOR<SKUCreateWithoutInventoriesInput, SKUUncheckedCreateWithoutInventoriesInput>
    where?: SKUWhereInput
  }

  export type SKUUpdateToOneWithWhereWithoutInventoriesInput = {
    where?: SKUWhereInput
    data: XOR<SKUUpdateWithoutInventoriesInput, SKUUncheckedUpdateWithoutInventoriesInput>
  }

  export type SKUUpdateWithoutInventoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutSkusNestedInput
    subCategory?: SubCategoryUpdateOneRequiredWithoutSkusNestedInput
    transactions?: TransactionUpdateManyWithoutSkuNestedInput
    billings?: BillingUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateWithoutInventoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    subCategoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutSkuNestedInput
    billings?: BillingUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type ShelfUpsertWithoutInventoriesInput = {
    update: XOR<ShelfUpdateWithoutInventoriesInput, ShelfUncheckedUpdateWithoutInventoriesInput>
    create: XOR<ShelfCreateWithoutInventoriesInput, ShelfUncheckedCreateWithoutInventoriesInput>
    where?: ShelfWhereInput
  }

  export type ShelfUpdateToOneWithWhereWithoutInventoriesInput = {
    where?: ShelfWhereInput
    data: XOR<ShelfUpdateWithoutInventoriesInput, ShelfUncheckedUpdateWithoutInventoriesInput>
  }

  export type ShelfUpdateWithoutInventoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
    rack?: RackUpdateOneRequiredWithoutShelvesNestedInput
  }

  export type ShelfUncheckedUpdateWithoutInventoriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    rackId?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
  }

  export type SKUCreateWithoutTransactionsInput = {
    id?: string
    skuCode: string
    productName: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutSkusInput
    subCategory: SubCategoryCreateNestedOneWithoutSkusInput
    inventories?: InventoryCreateNestedManyWithoutSkuInput
    billings?: BillingCreateNestedManyWithoutSkuInput
  }

  export type SKUUncheckedCreateWithoutTransactionsInput = {
    id?: string
    skuCode: string
    productName: string
    categoryId: string
    subCategoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    inventories?: InventoryUncheckedCreateNestedManyWithoutSkuInput
    billings?: BillingUncheckedCreateNestedManyWithoutSkuInput
  }

  export type SKUCreateOrConnectWithoutTransactionsInput = {
    where: SKUWhereUniqueInput
    create: XOR<SKUCreateWithoutTransactionsInput, SKUUncheckedCreateWithoutTransactionsInput>
  }

  export type UserCreateWithoutTransactionsInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
    role: RoleCreateNestedOneWithoutUsersInput
  }

  export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: string
    name: string
    email: string
    password: string
    roleId: string
    createdAt?: Date | string
  }

  export type UserCreateOrConnectWithoutTransactionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
  }

  export type SKUUpsertWithoutTransactionsInput = {
    update: XOR<SKUUpdateWithoutTransactionsInput, SKUUncheckedUpdateWithoutTransactionsInput>
    create: XOR<SKUCreateWithoutTransactionsInput, SKUUncheckedCreateWithoutTransactionsInput>
    where?: SKUWhereInput
  }

  export type SKUUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: SKUWhereInput
    data: XOR<SKUUpdateWithoutTransactionsInput, SKUUncheckedUpdateWithoutTransactionsInput>
  }

  export type SKUUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutSkusNestedInput
    subCategory?: SubCategoryUpdateOneRequiredWithoutSkusNestedInput
    inventories?: InventoryUpdateManyWithoutSkuNestedInput
    billings?: BillingUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    subCategoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventories?: InventoryUncheckedUpdateManyWithoutSkuNestedInput
    billings?: BillingUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type UserUpsertWithoutTransactionsInput = {
    update: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
    create: XOR<UserCreateWithoutTransactionsInput, UserUncheckedCreateWithoutTransactionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTransactionsInput, UserUncheckedUpdateWithoutTransactionsInput>
  }

  export type UserUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SKUCreateWithoutBillingsInput = {
    id?: string
    skuCode: string
    productName: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    category: CategoryCreateNestedOneWithoutSkusInput
    subCategory: SubCategoryCreateNestedOneWithoutSkusInput
    inventories?: InventoryCreateNestedManyWithoutSkuInput
    transactions?: TransactionCreateNestedManyWithoutSkuInput
  }

  export type SKUUncheckedCreateWithoutBillingsInput = {
    id?: string
    skuCode: string
    productName: string
    categoryId: string
    subCategoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
    inventories?: InventoryUncheckedCreateNestedManyWithoutSkuInput
    transactions?: TransactionUncheckedCreateNestedManyWithoutSkuInput
  }

  export type SKUCreateOrConnectWithoutBillingsInput = {
    where: SKUWhereUniqueInput
    create: XOR<SKUCreateWithoutBillingsInput, SKUUncheckedCreateWithoutBillingsInput>
  }

  export type CustomerCreateWithoutBillingsInput = {
    id?: string
    name: string
    gstNumber?: string | null
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
  }

  export type CustomerUncheckedCreateWithoutBillingsInput = {
    id?: string
    name: string
    gstNumber?: string | null
    address: string
    email?: string | null
    phone?: string | null
    createdAt?: Date | string
  }

  export type CustomerCreateOrConnectWithoutBillingsInput = {
    where: CustomerWhereUniqueInput
    create: XOR<CustomerCreateWithoutBillingsInput, CustomerUncheckedCreateWithoutBillingsInput>
  }

  export type SKUUpsertWithoutBillingsInput = {
    update: XOR<SKUUpdateWithoutBillingsInput, SKUUncheckedUpdateWithoutBillingsInput>
    create: XOR<SKUCreateWithoutBillingsInput, SKUUncheckedCreateWithoutBillingsInput>
    where?: SKUWhereInput
  }

  export type SKUUpdateToOneWithWhereWithoutBillingsInput = {
    where?: SKUWhereInput
    data: XOR<SKUUpdateWithoutBillingsInput, SKUUncheckedUpdateWithoutBillingsInput>
  }

  export type SKUUpdateWithoutBillingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutSkusNestedInput
    subCategory?: SubCategoryUpdateOneRequiredWithoutSkusNestedInput
    inventories?: InventoryUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateWithoutBillingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    subCategoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventories?: InventoryUncheckedUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type CustomerUpsertWithoutBillingsInput = {
    update: XOR<CustomerUpdateWithoutBillingsInput, CustomerUncheckedUpdateWithoutBillingsInput>
    create: XOR<CustomerCreateWithoutBillingsInput, CustomerUncheckedCreateWithoutBillingsInput>
    where?: CustomerWhereInput
  }

  export type CustomerUpdateToOneWithWhereWithoutBillingsInput = {
    where?: CustomerWhereInput
    data: XOR<CustomerUpdateWithoutBillingsInput, CustomerUncheckedUpdateWithoutBillingsInput>
  }

  export type CustomerUpdateWithoutBillingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomerUncheckedUpdateWithoutBillingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    gstNumber?: NullableStringFieldUpdateOperationsInput | string | null
    address?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BillingCreateWithoutCustomerInput = {
    id?: string
    invoiceId: string
    orderId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    sku: SKUCreateNestedOneWithoutBillingsInput
  }

  export type BillingUncheckedCreateWithoutCustomerInput = {
    id?: string
    invoiceId: string
    orderId: string
    skuId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
  }

  export type BillingCreateOrConnectWithoutCustomerInput = {
    where: BillingWhereUniqueInput
    create: XOR<BillingCreateWithoutCustomerInput, BillingUncheckedCreateWithoutCustomerInput>
  }

  export type BillingCreateManyCustomerInputEnvelope = {
    data: BillingCreateManyCustomerInput | BillingCreateManyCustomerInput[]
    skipDuplicates?: boolean
  }

  export type BillingUpsertWithWhereUniqueWithoutCustomerInput = {
    where: BillingWhereUniqueInput
    update: XOR<BillingUpdateWithoutCustomerInput, BillingUncheckedUpdateWithoutCustomerInput>
    create: XOR<BillingCreateWithoutCustomerInput, BillingUncheckedCreateWithoutCustomerInput>
  }

  export type BillingUpdateWithWhereUniqueWithoutCustomerInput = {
    where: BillingWhereUniqueInput
    data: XOR<BillingUpdateWithoutCustomerInput, BillingUncheckedUpdateWithoutCustomerInput>
  }

  export type BillingUpdateManyWithWhereWithoutCustomerInput = {
    where: BillingScalarWhereInput
    data: XOR<BillingUpdateManyMutationInput, BillingUncheckedUpdateManyWithoutCustomerInput>
  }

  export type PermissionCreateWithoutModuleInput = {
    id?: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
    role: RoleCreateNestedOneWithoutPermissionsInput
  }

  export type PermissionUncheckedCreateWithoutModuleInput = {
    id?: string
    roleId: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }

  export type PermissionCreateOrConnectWithoutModuleInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutModuleInput, PermissionUncheckedCreateWithoutModuleInput>
  }

  export type PermissionCreateManyModuleInputEnvelope = {
    data: PermissionCreateManyModuleInput | PermissionCreateManyModuleInput[]
    skipDuplicates?: boolean
  }

  export type PermissionUpsertWithWhereUniqueWithoutModuleInput = {
    where: PermissionWhereUniqueInput
    update: XOR<PermissionUpdateWithoutModuleInput, PermissionUncheckedUpdateWithoutModuleInput>
    create: XOR<PermissionCreateWithoutModuleInput, PermissionUncheckedCreateWithoutModuleInput>
  }

  export type PermissionUpdateWithWhereUniqueWithoutModuleInput = {
    where: PermissionWhereUniqueInput
    data: XOR<PermissionUpdateWithoutModuleInput, PermissionUncheckedUpdateWithoutModuleInput>
  }

  export type PermissionUpdateManyWithWhereWithoutModuleInput = {
    where: PermissionScalarWhereInput
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyWithoutModuleInput>
  }

  export type RoleCreateWithoutPermissionsInput = {
    id?: string
    name: string
    users?: UserCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutPermissionsInput = {
    id?: string
    name: string
    users?: UserUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutPermissionsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
  }

  export type ModuleCreateWithoutPermissionsInput = {
    id?: string
    name: string
  }

  export type ModuleUncheckedCreateWithoutPermissionsInput = {
    id?: string
    name: string
  }

  export type ModuleCreateOrConnectWithoutPermissionsInput = {
    where: ModuleWhereUniqueInput
    create: XOR<ModuleCreateWithoutPermissionsInput, ModuleUncheckedCreateWithoutPermissionsInput>
  }

  export type RoleUpsertWithoutPermissionsInput = {
    update: XOR<RoleUpdateWithoutPermissionsInput, RoleUncheckedUpdateWithoutPermissionsInput>
    create: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutPermissionsInput, RoleUncheckedUpdateWithoutPermissionsInput>
  }

  export type RoleUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    users?: UserUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type ModuleUpsertWithoutPermissionsInput = {
    update: XOR<ModuleUpdateWithoutPermissionsInput, ModuleUncheckedUpdateWithoutPermissionsInput>
    create: XOR<ModuleCreateWithoutPermissionsInput, ModuleUncheckedCreateWithoutPermissionsInput>
    where?: ModuleWhereInput
  }

  export type ModuleUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: ModuleWhereInput
    data: XOR<ModuleUpdateWithoutPermissionsInput, ModuleUncheckedUpdateWithoutPermissionsInput>
  }

  export type ModuleUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type ModuleUncheckedUpdateWithoutPermissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
  }

  export type TransactionCreateManyUserInput = {
    id?: string
    type: $Enums.TxType
    skuId: string
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
  }

  export type TransactionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: SKUUpdateOneRequiredWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    skuId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    skuId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyRoleInput = {
    id?: string
    name: string
    email: string
    password: string
    createdAt?: Date | string
  }

  export type PermissionCreateManyRoleInput = {
    id?: string
    moduleId: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }

  export type UserUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    transactions?: TransactionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PermissionUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    module?: ModuleUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type PermissionUncheckedUpdateWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PermissionUncheckedUpdateManyWithoutRoleInput = {
    id?: StringFieldUpdateOperationsInput | string
    moduleId?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
  }

  export type SubCategoryCreateManyCategoryInput = {
    id?: string
    name: string
    isActive?: boolean
    createdAt?: Date | string
  }

  export type SKUCreateManyCategoryInput = {
    id?: string
    skuCode: string
    productName: string
    subCategoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
  }

  export type SubCategoryUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: SKUUpdateManyWithoutSubCategoryNestedInput
  }

  export type SubCategoryUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    skus?: SKUUncheckedUpdateManyWithoutSubCategoryNestedInput
  }

  export type SubCategoryUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SKUUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subCategory?: SubCategoryUpdateOneRequiredWithoutSkusNestedInput
    inventories?: InventoryUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUpdateManyWithoutSkuNestedInput
    billings?: BillingUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    subCategoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventories?: InventoryUncheckedUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutSkuNestedInput
    billings?: BillingUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateManyWithoutCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    subCategoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SKUCreateManySubCategoryInput = {
    id?: string
    skuCode: string
    productName: string
    categoryId: string
    length?: number
    width?: number
    height?: number
    weight?: number
    barcode?: string | null
    barcodeFormat?: string
    stock?: number
    rackLocation?: string | null
    createdAt?: Date | string
  }

  export type SKUUpdateWithoutSubCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: CategoryUpdateOneRequiredWithoutSkusNestedInput
    inventories?: InventoryUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUpdateManyWithoutSkuNestedInput
    billings?: BillingUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateWithoutSubCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    inventories?: InventoryUncheckedUpdateManyWithoutSkuNestedInput
    transactions?: TransactionUncheckedUpdateManyWithoutSkuNestedInput
    billings?: BillingUncheckedUpdateManyWithoutSkuNestedInput
  }

  export type SKUUncheckedUpdateManyWithoutSubCategoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuCode?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    categoryId?: StringFieldUpdateOperationsInput | string
    length?: FloatFieldUpdateOperationsInput | number
    width?: FloatFieldUpdateOperationsInput | number
    height?: FloatFieldUpdateOperationsInput | number
    weight?: FloatFieldUpdateOperationsInput | number
    barcode?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeFormat?: StringFieldUpdateOperationsInput | string
    stock?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InventoryCreateManySkuInput = {
    id?: string
    shelfId: string
    quantity: number
    qrCode?: string | null
  }

  export type TransactionCreateManySkuInput = {
    id?: string
    type: $Enums.TxType
    quantity: number
    rackLocation?: string | null
    status?: string
    timestamp?: Date | string
    userId?: string | null
    barcodeValue?: string | null
    barcodeNumber?: string | null
    barcodeImageData?: string | null
  }

  export type BillingCreateManySkuInput = {
    id?: string
    invoiceId: string
    orderId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
    customerId?: string | null
  }

  export type InventoryUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    shelf?: ShelfUpdateOneRequiredWithoutInventoriesNestedInput
  }

  export type InventoryUncheckedUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    shelfId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryUncheckedUpdateManyWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    shelfId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneWithoutTransactionsNestedInput
  }

  export type TransactionUncheckedUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TransactionUncheckedUpdateManyWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: EnumTxTypeFieldUpdateOperationsInput | $Enums.TxType
    quantity?: IntFieldUpdateOperationsInput | number
    rackLocation?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeValue?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeNumber?: NullableStringFieldUpdateOperationsInput | string | null
    barcodeImageData?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customer?: CustomerUpdateOneWithoutBillingsNestedInput
  }

  export type BillingUncheckedUpdateWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingUncheckedUpdateManyWithoutSkuInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ShelfCreateManyRackInput = {
    id?: string
    level: $Enums.Level
    maxVolume: number
    maxWeight: number
    usedVolume?: number
    usedWeight?: number
  }

  export type ShelfUpdateWithoutRackInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
    inventories?: InventoryUpdateManyWithoutShelfNestedInput
  }

  export type ShelfUncheckedUpdateWithoutRackInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
    inventories?: InventoryUncheckedUpdateManyWithoutShelfNestedInput
  }

  export type ShelfUncheckedUpdateManyWithoutRackInput = {
    id?: StringFieldUpdateOperationsInput | string
    level?: EnumLevelFieldUpdateOperationsInput | $Enums.Level
    maxVolume?: FloatFieldUpdateOperationsInput | number
    maxWeight?: FloatFieldUpdateOperationsInput | number
    usedVolume?: FloatFieldUpdateOperationsInput | number
    usedWeight?: FloatFieldUpdateOperationsInput | number
  }

  export type InventoryCreateManyShelfInput = {
    id?: string
    skuId: string
    quantity: number
    qrCode?: string | null
  }

  export type InventoryUpdateWithoutShelfInput = {
    id?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: SKUUpdateOneRequiredWithoutInventoriesNestedInput
  }

  export type InventoryUncheckedUpdateWithoutShelfInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type InventoryUncheckedUpdateManyWithoutShelfInput = {
    id?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    qrCode?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingCreateManyCustomerInput = {
    id?: string
    invoiceId: string
    orderId: string
    skuId: string
    productName: string
    rackHistory: string
    duration: number
    weightCharges: number
    rackCharges: number
    amount: number
    status: string
    date: string
    gstPercent?: number | null
    companyName?: string | null
    companyGst?: string | null
    companyAddr?: string | null
    companyEmail?: string | null
    companyPhone?: string | null
    customerName?: string | null
    customerGst?: string | null
    customerAddr?: string | null
    customerEmail?: string | null
    customerPhone?: string | null
  }

  export type BillingUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
    sku?: SKUUpdateOneRequiredWithoutBillingsNestedInput
  }

  export type BillingUncheckedUpdateWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BillingUncheckedUpdateManyWithoutCustomerInput = {
    id?: StringFieldUpdateOperationsInput | string
    invoiceId?: StringFieldUpdateOperationsInput | string
    orderId?: StringFieldUpdateOperationsInput | string
    skuId?: StringFieldUpdateOperationsInput | string
    productName?: StringFieldUpdateOperationsInput | string
    rackHistory?: StringFieldUpdateOperationsInput | string
    duration?: IntFieldUpdateOperationsInput | number
    weightCharges?: FloatFieldUpdateOperationsInput | number
    rackCharges?: FloatFieldUpdateOperationsInput | number
    amount?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    date?: StringFieldUpdateOperationsInput | string
    gstPercent?: NullableFloatFieldUpdateOperationsInput | number | null
    companyName?: NullableStringFieldUpdateOperationsInput | string | null
    companyGst?: NullableStringFieldUpdateOperationsInput | string | null
    companyAddr?: NullableStringFieldUpdateOperationsInput | string | null
    companyEmail?: NullableStringFieldUpdateOperationsInput | string | null
    companyPhone?: NullableStringFieldUpdateOperationsInput | string | null
    customerName?: NullableStringFieldUpdateOperationsInput | string | null
    customerGst?: NullableStringFieldUpdateOperationsInput | string | null
    customerAddr?: NullableStringFieldUpdateOperationsInput | string | null
    customerEmail?: NullableStringFieldUpdateOperationsInput | string | null
    customerPhone?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionCreateManyModuleInput = {
    id?: string
    roleId: string
    canView?: boolean
    canCreate?: boolean
    canEdit?: boolean
    canDelete?: boolean
  }

  export type PermissionUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
    role?: RoleUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type PermissionUncheckedUpdateWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
  }

  export type PermissionUncheckedUpdateManyWithoutModuleInput = {
    id?: StringFieldUpdateOperationsInput | string
    roleId?: StringFieldUpdateOperationsInput | string
    canView?: BoolFieldUpdateOperationsInput | boolean
    canCreate?: BoolFieldUpdateOperationsInput | boolean
    canEdit?: BoolFieldUpdateOperationsInput | boolean
    canDelete?: BoolFieldUpdateOperationsInput | boolean
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoleCountOutputTypeDefaultArgs instead
     */
    export type RoleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryCountOutputTypeDefaultArgs instead
     */
    export type CategoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubCategoryCountOutputTypeDefaultArgs instead
     */
    export type SubCategoryCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubCategoryCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SKUCountOutputTypeDefaultArgs instead
     */
    export type SKUCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SKUCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RackCountOutputTypeDefaultArgs instead
     */
    export type RackCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RackCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShelfCountOutputTypeDefaultArgs instead
     */
    export type ShelfCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShelfCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerCountOutputTypeDefaultArgs instead
     */
    export type CustomerCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ModuleCountOutputTypeDefaultArgs instead
     */
    export type ModuleCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ModuleCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RoleDefaultArgs instead
     */
    export type RoleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RoleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CategoryDefaultArgs instead
     */
    export type CategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SubCategoryDefaultArgs instead
     */
    export type SubCategoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SubCategoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SKUDefaultArgs instead
     */
    export type SKUArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SKUDefaultArgs<ExtArgs>
    /**
     * @deprecated Use RackDefaultArgs instead
     */
    export type RackArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = RackDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ShelfDefaultArgs instead
     */
    export type ShelfArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ShelfDefaultArgs<ExtArgs>
    /**
     * @deprecated Use InventoryDefaultArgs instead
     */
    export type InventoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = InventoryDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TransactionDefaultArgs instead
     */
    export type TransactionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TransactionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use BillingDefaultArgs instead
     */
    export type BillingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = BillingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CustomerDefaultArgs instead
     */
    export type CustomerArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomerDefaultArgs<ExtArgs>
    /**
     * @deprecated Use CompanySettingDefaultArgs instead
     */
    export type CompanySettingArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CompanySettingDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ModuleDefaultArgs instead
     */
    export type ModuleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ModuleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PermissionDefaultArgs instead
     */
    export type PermissionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PermissionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SystemLogDefaultArgs instead
     */
    export type SystemLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SystemLogDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}