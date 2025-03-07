import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { shopifyUpdateInventoryQuantity } from "@/lib/shopify/apiRequests/shopifyUpdateInventoryQuantity";
import updateProductService from "@/service/updateProductService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { MappedProduct } from "./ProductsDataTable";
import { DialogClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";

const formSchema = z.object({
  stock: z.string(),
});

interface UpdateQuantityDialogProps {
  product: MappedProduct;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  updateProduct: (
    id: string,
    values: Record<string, string | number | boolean>
  ) => void;
}

export function UpdateQuantityDialog({
  product,
  isDialogOpen,
  setIsDialogOpen,
  updateProduct,
}: UpdateQuantityDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(
    values: z.infer<typeof formSchema> & { inventoryItemId: string }
  ) {
    if (values.stock === "") {
      toast("Cantitatea nu poate fi goala");
      return;
    }
    await shopifyUpdateInventoryQuantity({
      input: {
        name: "available",
        reason: "correction",
        ignoreCompareQuantity: true,
        quantities: [
          {
            inventoryItemId: values.inventoryItemId,
            locationId: "gid://shopify/Location/102476317020",
            quantity: parseInt(values.stock),
          },
        ],
      },
    });
    await updateProductService(values.inventoryItemId, {
      stock: parseInt(values.stock),
    });
    updateProduct(values.inventoryItemId, {
      stock: parseInt(values.stock),
    });
    setIsDialogOpen(false);
    toast("Cantitate actualizata cu succes");
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={() => form.reset()}>
      <DialogContent className="w-[300px] md:w-[400px]">
        <DialogClose onClick={() => setIsDialogOpen(false)}>
          <X className="h-4 w-4 absolute top-0 right-0 m-2 hover:scale-[1.1]" />
        </DialogClose>
        <DialogTitle>Inventar</DialogTitle>
        <div className="grid gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Seteaza noua cantitate.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-1 items-center gap-4">
              <Form {...form}>
                <form className="space-y-8 w-full">
                  <FormField
                    control={form.control}
                    defaultValue={String(product.stock)}
                    name="stock"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Cantitate</FormLabel>
                        <FormControl>
                          <Input
                            className="w-full"
                            type="number"
                            placeholder="shadcn"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </form>
                <Button
                  onClick={form.control.handleSubmit(() =>
                    onSubmit({
                      ...form.getValues(),
                      inventoryItemId: product.inventoryItemId,
                    })
                  )}
                  type="submit"
                >
                  Salveaza
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
