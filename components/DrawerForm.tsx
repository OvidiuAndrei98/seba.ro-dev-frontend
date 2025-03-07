import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { shopifyAddProductService } from "@/lib/shopify/apiRequests/shopifyAddProductService";
import { addProductService } from "@/service/addProductService";
import { firebaseAuth } from "@/lib/firebase/firebaseConfig";
import { toast } from "sonner";
import { Product } from "@/lib/types";
import { useContext } from "react";
import { UserContext } from "@/app/layout";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Campul este obligatoriu",
  }),
  description: z.string().min(1, {
    message: "Campul este obligatoriu",
  }),
  price: z.string().min(1, {
    message: "Campul este obligatoriu",
  }),
  quantity: z.string().min(1, {
    message: "Campul este obligatoriu",
  }),
  condition: z.string().min(1, {
    message: "Campul este obligatoriu",
  }),
});

const DrawerForm = ({
  setOpen,
  updateProducts,
}: {
  setOpen: (open: boolean) => void;
  updateProducts: (products: Product) => void;
}) => {
  const userContext = useContext(UserContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      quantity: "",
      condition: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>): Promise<void> {
    if (!firebaseAuth.currentUser) {
      return;
    }
    const prod = await shopifyAddProductService({
      synchronous: true,
      productSet: {
        title: values.title,
        descriptionHtml: values.description,
        status: "DRAFT",
        productOptions: [
          {
            name: "Conditie",
            position: 1,
            values: [
              {
                name: values.condition as "CA NOU" | "FOLOSIT",
              },
            ],
          },
        ],
        variants: [
          {
            optionValues: [
              {
                optionName: "Conditie",
                name: values.condition,
              },
            ],
            price: parseInt(values.price),
            inventoryItem: {
              tracked: true,
              sku: userContext.vendorId,
            },
            inventoryQuantities: [
              {
                locationId: "gid://shopify/Location/102476317020",
                quantity: parseInt(values.quantity),
                name: "available",
              },
            ],
            inventoryPolicy: "DENY",
          },
        ],
      },
    });

    const productToBeAdded = {
      clientId: firebaseAuth.currentUser.uid,
      clientIdRef: "clients/" + firebaseAuth.currentUser?.uid,
      condition: values.condition as "CA NOU" | "FOLOSIT",
      description: values.description,
      price: parseInt(values.price),
      productId: prod.body?.data.productSet.product.id,
      stock: 1,
      title: values.title,
      inventoryItemId:
        prod.body?.data.productSet.product.variants.edges[0].node.inventoryItem
          .id,
    };

    addProductService(productToBeAdded);
    setOpen(false);
    toast("Produsul a fost adaugat");
    updateProducts(productToBeAdded);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 px-4 overflow-auto h-full pb-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-black">Titlu</FormLabel>
              <FormControl>
                <Input placeholder="Titlu" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="!mt-2">
              <FormLabel className="text-black">Descriere</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descriere produs"
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="!mt-2">
              <FormLabel className="text-black">Pret</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Pret" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem className="!mt-2">
              <FormLabel className="text-black">Cantitate</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Cantitate" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem className="!mt-2">
              <FormLabel className="text-black">Conditie produs</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteaza conditia produsului" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CA NOU">CA NOU</SelectItem>
                  <SelectItem value="FOLOSIT">FOLOSIT</SelectItem>
                  {/* <SelectItem value="m@support.com">m@support.com</SelectItem> */}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Adauga
        </Button>
      </form>
    </Form>
  );
};

export default DrawerForm;
