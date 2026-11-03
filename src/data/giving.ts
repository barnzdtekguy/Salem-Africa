export type GivingAccount = {
  purpose: string;
  bank: string;
  accountNumber: string;
  accountName: string | null;
  paymentUrl: string;
  confirmationStatus: 'confirmed' | 'incomplete';
};

export type GivingFund = {
  purpose: string;
  account: GivingAccount | null;
  paymentUrl: string;
};

export const GIVING_ACCOUNTS: GivingAccount[] = [
  {
    purpose: 'Evangelism',
    bank: 'First Bank',
    accountNumber: '2023697841',
    accountName: 'Foundation Faith Church (Salem) (Kindercare)',
    paymentUrl: '',
    confirmationStatus: 'confirmed',
  },
  {
    purpose: 'Training',
    bank: 'GTBank',
    accountNumber: '0139013570',
    accountName: 'Salem Wisdom Training School',
    paymentUrl: '',
    confirmationStatus: 'confirmed',
  },
  {
    purpose: 'Africa Mission',
    bank: 'First Bank of Nigeria',
    accountNumber: '2012576678',
    accountName: 'Foundation Faith Church (Salem)',
    paymentUrl: '',
    confirmationStatus: 'confirmed',
  },
  {
    purpose: 'Mega Project',
    bank: 'First Bank of Nigeria',
    accountNumber: '',
    accountName: null,
    paymentUrl: '',
    confirmationStatus: 'incomplete',
  },
  {
    purpose: 'Welfare',
    bank: 'GTBank',
    accountNumber: '0137941721',
    accountName: 'Salem Welfare',
    paymentUrl: '',
    confirmationStatus: 'confirmed',
  },
  {
    purpose: 'Educational',
    bank: 'GTBank',
    accountNumber: '0137941697',
    accountName: 'Salem Kindercare',
    paymentUrl: '',
    confirmationStatus: 'confirmed',
  },
];

export const GIVING_FUNDS: GivingFund[] = [
  { purpose: 'Offering (Kingdom Covenant Investment)', account: null, paymentUrl: '' },
  { purpose: 'Tithe', account: null, paymentUrl: '' },
];
