
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  roleId: 'roleId',
  createdAt: 'createdAt'
};

exports.Prisma.RoleScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.SubCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  isActive: 'isActive',
  categoryId: 'categoryId',
  createdAt: 'createdAt'
};

exports.Prisma.SKUScalarFieldEnum = {
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

exports.Prisma.RackScalarFieldEnum = {
  id: 'id',
  name: 'name',
  room: 'room'
};

exports.Prisma.ShelfScalarFieldEnum = {
  id: 'id',
  rackId: 'rackId',
  level: 'level',
  maxVolume: 'maxVolume',
  maxWeight: 'maxWeight',
  usedVolume: 'usedVolume',
  usedWeight: 'usedWeight'
};

exports.Prisma.InventoryScalarFieldEnum = {
  id: 'id',
  skuId: 'skuId',
  shelfId: 'shelfId',
  quantity: 'quantity',
  qrCode: 'qrCode'
};

exports.Prisma.TransactionScalarFieldEnum = {
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

exports.Prisma.BillingScalarFieldEnum = {
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

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  name: 'name',
  gstNumber: 'gstNumber',
  address: 'address',
  email: 'email',
  phone: 'phone',
  createdAt: 'createdAt'
};

exports.Prisma.CompanySettingScalarFieldEnum = {
  id: 'id',
  name: 'name',
  gstin: 'gstin',
  address: 'address',
  email: 'email',
  phone: 'phone',
  createdAt: 'createdAt'
};

exports.Prisma.ModuleScalarFieldEnum = {
  id: 'id',
  name: 'name'
};

exports.Prisma.PermissionScalarFieldEnum = {
  id: 'id',
  roleId: 'roleId',
  moduleId: 'moduleId',
  canView: 'canView',
  canCreate: 'canCreate',
  canEdit: 'canEdit',
  canDelete: 'canDelete'
};

exports.Prisma.SystemLogScalarFieldEnum = {
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

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Room = exports.$Enums.Room = {
  Room1: 'Room1',
  Room2: 'Room2',
  Cabin: 'Cabin'
};

exports.Level = exports.$Enums.Level = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

exports.TxType = exports.$Enums.TxType = {
  INWARD: 'INWARD',
  OUTWARD: 'OUTWARD'
};

exports.LogUser = exports.$Enums.LogUser = {
  Admin: 'Admin',
  Manager: 'Manager',
  System: 'System',
  Operator1: 'Operator1',
  Operator2: 'Operator2'
};

exports.LogAction = exports.$Enums.LogAction = {
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

exports.LogStatus = exports.$Enums.LogStatus = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

exports.Prisma.ModelName = {
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

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
