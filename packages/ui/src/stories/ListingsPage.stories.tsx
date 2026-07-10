import type { Meta, StoryObj } from "@storybook/react";
import { mockFiltersResponse, mockListings } from "@asd/domain";
import ListingsPage from "../components/listings/ListingsPage";

const meta: Meta<typeof ListingsPage> = {
  title: "Components/ListingsPage",
  component: ListingsPage,
};

export default meta;
type Story = StoryObj<typeof ListingsPage>;

export const Default: Story = {
  args: {
    listings: mockListings,
    filters: mockFiltersResponse,
    initialValues: { postalCode: "90210" },
    onNextStep: () => console.log("next step"),
    onApplyFilters: (values) => console.log("apply filters", values),
  },
};
