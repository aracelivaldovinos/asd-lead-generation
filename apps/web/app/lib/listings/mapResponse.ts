import { Listing } from "@asd/domain";

type WebUIRawResponse = { listings: Listing[] };

type MMResult = {
  clickURL: string;
  mBrandName: string;
  headContent: string;
  bodyContent: string;
  imageURL: string;
  mBrandID: string;
};

type MMResponse = { result: MMResult[] };

type EddyAd = {
  adId: string;
  institutionName: string;
  logoMediumImage: string;
  header: string;
  description: string;
  clickThroughUrl: string;
};

type EddyResponse = { ads: EddyAd[] };

const ZETA_CLICK_BASE = "https://bustleglow.com/?a=3140&c=233936&p=c&s1=";

const ZETA_BODY = `
<strong>With just a bit of information, we'll use our degree-matching expertise to find you an online degree program in minutes.</strong>
<table>
  <tr>
    <td>› Arts & Design</td>
    <td>› Psychology</td>
    <td>› Engineering and Technology</td>
  </tr>
  <tr>
    <td>› Business</td>
    <td>› Trade and Vocational</td>
    <td>› Law and Criminal Justice</td>
  </tr>
  <tr>
    <td>› Education</td>
    <td>› Healthcare</td>
    <td>› Hospitality and Culinary</td>
  </tr>
</table>
`.trim();

export const mapResponse = (
  raw: unknown,
  providerId: string,
): Listing[] => {
  switch (providerId) {
    case "rfi":
    case "linkouts":
      return (raw as WebUIRawResponse).listings ?? [];
    case "mm":
      return mapMM(raw as MMResponse);
    case "eddy":
      return mapEddy(raw as EddyResponse);
    default:
      return [];
  }
};

export const mapZeta = (session: string): Listing[] => {
  const url = new URL(ZETA_CLICK_BASE);
  url.searchParams.set("s2", session);

  const listings: Listing[] = [
    {
      name: "ZETABAND",
      message: "",
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
                  displayName: "Study On Your Own Schedule",
                  degreeName: "",
                  clickTrackingUrl: url.toString(),
                  programId: "zeta",
                  programInfo: ZETA_BODY,
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  return listings;
};

const appendMMClickParam = (rawUrl: string): string => {
  const url = new URL(rawUrl);
  url.searchParams.append("clickParamName", "sub3");
  return url.toString();
};

const mapMM = (response: MMResponse): Listing[] =>
  response.result.map((item) => ({
    name: "MMBAND",
    message: "",
    schools: [
      {
        id: item.mBrandID,
        displayName: item.mBrandName,
        logo: { src: item.imageURL, width: 0, height: 0 },
        locations: [
          {
            instructionMethod: "Online",
            programs: [
              {
                displayName: item.headContent,
                degreeName: "",
                clickTrackingUrl: appendMMClickParam(item.clickURL),
                programId: item.mBrandID,
                programInfo: item.bodyContent,
              },
            ],
          },
        ],
      },
    ],
  }));

const mapEddy = (response: EddyResponse): Listing[] =>
  response.ads.map((item) => ({
    name: "EDDYBAND",
    message: "",
    schools: [
      {
        id: item.adId,
        displayName: item.institutionName,
        logo: { src: item.logoMediumImage, width: 0, height: 0 },
        locations: [
          {
            instructionMethod: "Online",
            programs: [
              {
                displayName: item.header,
                degreeName: "",
                clickTrackingUrl: item.clickThroughUrl,
                programId: item.adId,
                programInfo: item.description,
              },
            ],
          },
        ],
      },
    ],
  }));
