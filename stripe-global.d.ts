declare module '@stripe/stripe-js' {
  export function loadStripe(key: string): Promise<any>;
}

declare module '@stripe/react-stripe-js' {
  export const Elements: any;
  export const PaymentElement: any;
  export function useStripe(): any;
  export function useElements(): any;
}
