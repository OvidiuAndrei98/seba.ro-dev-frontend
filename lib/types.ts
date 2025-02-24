export interface Product {
  clientId: string;
  clientIdRef: string;
  condition: "CA NOU" | "FOLOSIT";
  description: string;
  price: number;
  title: string;
  stock: number;
  productId: string;
}

/**
 * Properties for the login component.
 */
export interface LoginPageProps {
  params: {
    /**
     * Invoked when the sign in button is pressed. Must start the authentication
     * flow.
     */
    onLogin(email: string, password: string): void;
    /**
     * When set to `true`, a loading indicator is displayed over the login form.
     */
    loggingIn?: boolean;
  };
}
