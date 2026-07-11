import type { Meta, StoryObj } from "@storybook/react";
import { mockRFIResponse, mockPrograms } from "@asd/domain";
import RFIForm from "../components/rfi/RFIForm";

const meta: Meta<typeof RFIForm> = {
  title: "Components/RFIForm",
  component: RFIForm,
};

export default meta;
type Story = StoryObj<typeof RFIForm>;

export const Default: Story = {
  args: {
    response: mockRFIResponse,
    programs: mockPrograms,
    submitUrl: "/api/rfi",
    onComplete: () => console.log("complete"),
    onProgramChange: (program) => console.log("program changed", program),
    onProgramSkip: () => console.log("program skip")
  },
};

export const SingleProgram: Story = {
  args: {
    response: mockRFIResponse,
    programs: [mockPrograms[0]],
    submitUrl: "/api/rfi",
    onComplete: () => console.log("complete"),
    onProgramChange: (program) => console.log("program changed", program),
    onProgramSkip: () => console.log("program skip")
  },
};
