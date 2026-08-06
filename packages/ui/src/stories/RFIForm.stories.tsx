import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { mockRFIResponse, mockRFIResponse2, mockPrograms, mockProgramsSchool2 } from "@asd/domain";
import RFIForm from "../components/rfi/RFIForm";
import { useRFIStore } from "../store/rfiStore";
import type { RFIResponse } from "@asd/domain";

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
    initQueue(mockPrograms);
  }, []);
  return <Story />;
};

export const WithProgramDropdown: Story = {
  args: defaultArgs,
  decorators: [WithProgramsDecorator],
};

const rfiResponsesBySchool: Record<number | string, RFIResponse> = {
  28: mockRFIResponse,
  29: mockRFIResponse2,
};

export const MultiSchoolQueue: Story = {
  beforeEach: () => {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("/api/rfi") && init?.method === "POST") {
        return new Response(JSON.stringify({ fieldErrors: {} }), {
          headers: { "Content-Type": "application/json" },
        });
      }
      return originalFetch(input, init);
    };
    return () => { window.fetch = originalFetch; };
  },
  render: (args) => {
    const MultiSchoolQueueStory = () => {
      const { initQueue, initPrograms } = useRFIStore();
      const [response, setResponse] = useState<RFIResponse>(mockRFIResponse);

      useEffect(() => {
        const allPrograms = [mockPrograms[0], mockProgramsSchool2[0]];
        initPrograms(allPrograms);
        initQueue(allPrograms);
      }, []);

      const handleAdvance = () => {
        const { queue } = useRFIStore.getState();
        if (queue.length > 0) {
          const next = rfiResponsesBySchool[queue[0].school.id] ?? mockRFIResponse;
          setResponse(next);
        } else {
          console.log("all done");
        }
      };

      return (
        <RFIForm
          {...args}
          response={response}
          onComplete={handleAdvance}
          onProgramSkip={handleAdvance}
        />
      );
    };
    return <MultiSchoolQueueStory />;
  },
  args: defaultArgs,
};
