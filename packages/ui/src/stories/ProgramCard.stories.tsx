import type { Meta, StoryObj } from "@storybook/react";
import ProgramCard from "../components/ProgramCard";

const meta: Meta<typeof ProgramCard> = {
  title: "Components/ProgramCard",
  component: ProgramCard,
};

export default meta;
type Story = StoryObj<typeof ProgramCard>;

export const RFI: Story = {
  args: {
    program: {
      programId: "1",
      displayName: "Practical Nursing",
      degreeName: "Diploma",
      instructionMethod: "Campus",
      clickTrackingUrl: "",
      school: {
        id: 123,
        displayName: "Southeastern College",
      },
      programInfo: "The Diagnostic Medical Sonography Technology Program presents an integration of didactic, laboratory and clinical experiences."
    },
  },
};

export const Linkout: Story = {
  args: {
    program: {
      programId: "2",
      displayName: "Diagnostic Medical Sonography",
      degreeName: "Associate's",
      instructionMethod: "Online",
      clickTrackingUrl: "http://click.com",
      school: {
        id: 123,
        displayName: "Southeastern College",
      },
        programInfo: "<p>The Diagnostic Medical Sonography Technology Program presents an integration of didactic, laboratory and clinical experiences. The program prepares students to function as entry-level diagnostic medical sonographers. Sonographers are highly skilled professionals qualified to provide patient services using diagnostic techniques under the supervision of a licensed doctor of medicine or osteopathy and assist physicians in gathering data necessary to reach diagnostic decisions.</p>"
    },
  },
};
