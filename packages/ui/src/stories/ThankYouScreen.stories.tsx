import type { Meta, StoryObj } from "@storybook/react";
import { mockListings, mockPrograms } from "@asd/domain";
import ThankYouScreen from "../components/thankyou/ThankYouScreen";

const mockThankYouListings = [
  {
    name: "ZETABAND",
    message: "",
    showOnThankYou: true,
    schools: [
      {
        id: "zeta",
        displayName: "GetanEducationOnline.com",
        logo: {
          src: "https://www.getaneducationonline.com/images/degreesInfo/700/assets/Zdc0s/gaeo_logo_2x.png",
          width: 0,
          height: 0,
        },
        locations: [
          {
            instructionMethod: "Online",
            programs: [
              {
                programId: "zeta",
                displayName: "Study On Your Own Schedule",
                degreeName: "",
                programInfo: `<strong>With just a bit of information, we'll use our degree-matching expertise to find you an online degree program in minutes.</strong><table><tr><td>› Arts &amp; Design</td><td>› Psychology</td><td>› Engineering and Technology</td></tr><tr><td>› Business</td><td>› Trade and Vocational</td><td>› Law and Criminal Justice</td></tr><tr><td>› Education</td><td>› Healthcare</td><td>› Hospitality and Culinary</td></tr></table>`,
                clickTrackingUrl: "https://bustleglow.com/?a=3140",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "MMBAND",
    message: "",
    showOnThankYou: true,
    schools: [
      {
        id: "mm-123",
        displayName: "Ultimate Medical Academy",
        logo: { src: "", width: 0, height: 0 },
        locations: [
          {
            instructionMethod: "Online",
            programs: [
              {
                programId: "mm-123",
                displayName: "Ultimate Medical Academy®",
                degreeName: "",
                programInfo: "Train For A Career In Healthcare. Degree Classes Start Soon. Contact Us Now.",
                clickTrackingUrl: "https://example.com/click/mm",
              },
            ],
          },
        ],
      },
    ],
  },
  ...mockListings,
];
import { useFormStore } from "../store/formStore";
import { useRFIStore } from "../store/rfiStore";
import { useEffect } from "react";

const WithStoreData = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    useFormStore.setState({ savedValues: { firstName: "Jane" } });
    useRFIStore.setState({
      submittedPrograms: mockPrograms.slice(0, 2),
    });
  }, []);
  return <>{children}</>;
};

const meta: Meta<typeof ThankYouScreen> = {
  title: "Components/ThankYouScreen",
  component: ThankYouScreen,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ThankYouScreen>;

export const Mobile: Story = {
  args: {
    listings: mockThankYouListings,
  },
  decorators: [(Story) => <WithStoreData><div style={{ width: "100vw" }}><Story /></div></WithStoreData>],
  parameters: {
    layout: "fullscreen",
    viewport: {
      defaultViewport: "mobile1",
    },
  },
};

export const Desktop: Story = {
  args: {
    listings: mockThankYouListings,
  },
  decorators: [(Story) => <WithStoreData><Story /></WithStoreData>],
  parameters: {
    viewport: {
      defaultViewport: "desktop",
    },
  },
};
