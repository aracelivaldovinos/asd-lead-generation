import type { Meta, StoryObj } from "@storybook/react";
import { mockPrefilterQuestions, selectPrefilterQuestions } from "@asd/domain";
import CTA, { CTAConfig } from "../components/cta/CTA";

const meta: Meta<typeof CTA> = {
  title: "Components/CTA",
  component: CTA,
};

export default meta;
type Story = StoryObj<typeof CTA>;

const defaultConfig: CTAConfig = {
  title: "Search for programs near you",
  buttonLabel: "FIND SCHOOLS",
};

export const Default: Story = {
  args: {
    questions: selectPrefilterQuestions(mockPrefilterQuestions, ["postalCode", "education", "subjectArea"]),
    config: defaultConfig,
    action: "/search",
  },
};

export const SingleDropdown: Story = {
  args: {
    variant: "single-dropdown",
    question: mockPrefilterQuestions.find((q) => q.key === "subjectArea")!,
    config: defaultConfig,
    action: "/search",
  },
};

export const Button: Story = {
  args: {
    variant: "button",
    label: "FIND SCHOOLS",
    onSubmit: () => console.log("submit"),
  },
};
