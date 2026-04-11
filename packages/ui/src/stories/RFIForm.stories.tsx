 import type { Meta, StoryObj } from "@storybook/react";
  import RFIForm from "../components/RFIForm";
  import { mockRFIResponse } from "@asd/domain";

  const meta: Meta<typeof RFIForm> = {
      title: "Components/RFIForm",
      component: RFIForm,
  };

  export default meta;
  type Story = StoryObj<typeof RFIForm>;

  export const Default: Story = {
      args: {
          response: mockRFIResponse
      }
  };