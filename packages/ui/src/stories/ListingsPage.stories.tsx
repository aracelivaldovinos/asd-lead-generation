import type { Meta, StoryObj } from "@storybook/react";
import { mockListings } from "@asd/domain";
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
    onNextStep: () => console.log("next step"),
  },
};
