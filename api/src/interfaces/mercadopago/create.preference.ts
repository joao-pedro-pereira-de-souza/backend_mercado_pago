
export interface ICreatePreference {
  additional_info: string;
  auto_return: string;
  back_urls: BackUrls;
  binary_mode: boolean;
  client_id: string;
  collector_id: number;
  coupon_code: any;
  coupon_labels: any;
  date_created: string;
  date_of_expiration: any;
  expiration_date_from: any;
  expiration_date_to: any;
  expires: boolean;
  external_reference: string;
  id: string;
  init_point: string;
  internal_metadata: any;
  items: Item[];
  marketplace: string;
  marketplace_fee: number;
  metadata: Metadata;
  notification_url: any;
  operation_type: string;
  payer: Payer;
  payment_methods: PaymentMethods;
  processing_modes: any;
  product_id: any;
  redirect_urls: RedirectUrls;
  sandbox_init_point: string;
  site_id: string;
  shipments: Shipments;
  total_amount: any;
  last_updated: any;
  financing_group: string;
  api_response: ApiResponse;
}

export interface BackUrls {
  failure: string;
  pending: string;
  success: string;
}

export interface Item {
  id: string;
  category_id: string;
  currency_id: string;
  description: string;
  title: string;
  quantity: number;
  unit_price: number;
}

export interface Metadata {}

export interface Payer {
  phone: Phone;
  address: Address;
  email: string;
  identification: Identification;
  name: string;
  surname: string;
  date_created: any;
  last_purchase: any;
}

export interface Phone {
  area_code: string;
  number: string;
}

export interface Address {
  zip_code: string;
  street_name: string;
  street_number: any;
}

export interface Identification {
  number: string;
  type: string;
}

export interface PaymentMethods {
  default_card_id: any;
  default_payment_method_id: any;
  excluded_payment_methods: ExcludedPaymentMethod[];
  excluded_payment_types: ExcludedPaymentType[];
  installments: any;
  default_installments: any;
}

export interface ExcludedPaymentMethod {
  id: string;
}

export interface ExcludedPaymentType {
  id: string;
}

export interface RedirectUrls {
  failure: string;
  pending: string;
  success: string;
}

export interface Shipments {
  default_shipping_method: any;
  receiver_address: ReceiverAddress;
}

export interface ReceiverAddress {
  zip_code: string;
  street_name: string;
  street_number: any;
  floor: string;
  apartment: string;
  city_name: any;
  state_name: any;
  country_name: any;
}

export interface ApiResponse {
  status: number;
  headers: Headers;
}

export interface Headers {
  date: string[];
  'content-type': string[];
  'content-length': string[];
  connection: string[];
  'content-encoding': string[];
  vary: string[];
  'x-content-type-options': string[];
  'x-request-id': string[];
  'x-xss-protection': string[];
  'strict-transport-security': string[];
  'access-control-allow-origin': string[];
  'access-control-allow-headers': string[];
  'access-control-allow-methods': string[];
  'access-control-max-age': string[];
  'timing-allow-origin': string[];
}
