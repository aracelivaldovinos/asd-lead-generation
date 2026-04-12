import type { Meta, StoryObj } from "@storybook/react";
import { mockRFIResponse } from "@asd/domain";
import RFIForm from "../components/RFIForm";


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