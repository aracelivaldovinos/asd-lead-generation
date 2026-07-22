import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { mockRFIResponse, mockPrograms } from "@asd/domain";
import RFIForm from "../components/rfi/RFIForm";
import { useRFIStore } from "../store/rfiStore";

const meta: Meta<typeof RFIForm> = {
  title: "Components/RFIForm",
  component: RFIForm,
};

export default meta;
type Story = StoryObj<typeof RFIForm>;

const defaultArgs = {
  response: mockRFIResponse,
  submitUrl: "/api/rfi",
  onComplete: () => console.log("complete"),
  onProgramChange: (program: unknown) => console.log("program changed", program),
  onProgramSkip: () => console.log("program skip"),
};

const SingleProgramDecorator = (Story: React.ComponentType) => {
  const { initQueue, initPrograms } = useRFIStore();
  useEffect(() => {
    initPrograms([mockPrograms[0]]);
    initQueue([mockPrograms[0]]);
  }, []);
  return <Story />;
};

export const SingleProgram: Story = {
  args: defaultArgs,
  decorators: [SingleProgramDecorator],
};

const WithProgramsDecorator = (Story: React.ComponentType) => {
  const { initQueue, initPrograms } = useRFIStore();
  useEffect(() => {
    initPrograms(mockPrograms);
    initQueue([mockPrograms[0]]);
  }, []);
  return <Story />;
};

export const WithProgramDropdown: Story = {
  args: defaultArgs,
  decorators: [WithProgramsDecorator],
};
