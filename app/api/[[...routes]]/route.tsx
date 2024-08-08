/** @jsxImportSource frog/jsx */

import { Button, Frog, FrogConstructorParameters, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { neynar as neynarHub } from 'frog/hubs'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { neynar } from 'frog/middlewares'
import moment from 'moment'
import { UserService } from '@/lib/services/user.service'


const apiKey = process.env.NEYNAR_API_KEY as string;
const HOSTNAME = "https://doiq-frame.vercel.app"

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynarHub({ apiKey })
  // hub: neynar({ apiKey })
} as FrogConstructorParameters)
  .use(neynar(
    {
      apiKey,
      features: ['interactor', 'cast'],
    }
  ))

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

const answers = ["doiq", "doiq?", "doiq!"]
const getRandomAnswer = () => {
  return answers[Math.floor(Math.random() * answers.length)];
};

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame('/', (c) => {
  const { buttonValue } = c
  return c.res({
    action: '/doiq',
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'white',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'black',
            fontSize: 180,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.0,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          doiq?
        </div>
        <div
          style={{
            color: 'black',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            padding: '0 240px',
            whiteSpace: 'pre-wrap',
          }}
        >
          click to doiq
        </div>
      </div>
    ),
    intents: [
      <Button>Start</Button>,
      <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
      <Button.Link href='https://docs.doiq.xyz/'>Learn</Button.Link>,
    ],
  })
})

app.frame('/doiq', async (c) => {
  const { buttonValue } = c;

  let user = null;
  let isUpdatedMoreThan10Mins = false;
  let lastUpdated = null;
  const tenMinutesAgo = moment().subtract(10, 'minutes');

  try {
    const response = await UserService.fetchUserByFidFromFrontend(c.var.interactor?.fid.toString() as string);
    user = response.user;
    if (user) {
      lastUpdated = moment(user.updatedAt);
      isUpdatedMoreThan10Mins = lastUpdated.isBefore(tenMinutesAgo);
      // console.log('User found', user);
      // console.log('Last Updated:', lastUpdated);
      // console.log('Is Updated More Than 10 Mins:', isUpdatedMoreThan10Mins);
      if (isUpdatedMoreThan10Mins) {
        return c.res({
          action: `/result`,
          image: (
            <div
              style={{
                alignItems: 'center',
                background: 'white',
                backgroundSize: '100% 100%',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                height: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  color: 'black',
                  fontSize: 90,
                  fontStyle: 'normal',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.4,
                  marginTop: 30,
                  padding: '0 120px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                I like to _________
              </div>
            </div>
          ),
          intents: [
            <Button value="doiq">doiq</Button>,
            <Button value="doiq?">doiq?</Button>,
            <Button value="doiq!">doiq!</Button>,
          ],
        });
      } else {
        
        const minutesLeft = (10 - moment().diff(lastUpdated)).toString();
        // console.log(minutesLeft)
        return c.res({
          action: '/',
          image: (
            <div
              style={{
                alignItems: 'center',
                background: 'white',
                backgroundSize: '100% 100%',
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                height: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
              }}
            >
              <div
                style={{
                  color: 'black',
                  fontSize: 62,
                  fontStyle: 'normal',
                  letterSpacing: '-0.025em',
                  lineHeight: 1,
                  marginTop: 30,
                  padding: '0 120px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {`Hi ${c.var.interactor?.username as string}, You've doiqed too hard.`}
              </div>
              <div
                style={{
                  color: 'black',
                  fontSize: 40,
                  fontStyle: 'normal',
                  letterSpacing: '-0.025em',
                  lineHeight: 1,
                  marginTop: 30,
                  padding: '0 120px',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {`You can doiq again in about ${minutesLeft} minutes`}
              </div>
            </div>
          ),
          intents: [
            <Button>Home</Button>,
            <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
          ],
        });
      }
    } else {
      return c.res({
        action: `/result`,
        image: (
          <div
            style={{
              alignItems: 'center',
              background: 'white',
              backgroundSize: '100% 100%',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              height: '100%',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'black',
                fontSize: 90,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                lineHeight: 1.4,
                marginTop: 30,
                padding: '0 120px',
                whiteSpace: 'pre-wrap',
              }}
            >
              I like to _________
            </div>
          </div>
        ),
        intents: [
          <Button value="doiq">doiq</Button>,
          <Button value="doiq?">doiq?</Button>,
          <Button value="doiq!">doiq!</Button>,
        ],
      });
    }



  } catch (error: any) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'white',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 62,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {`An error occurred: ${error.message}`}
          </div>
        </div>
      ),
    });

  }


});


app.frame('/result', async (c) => {
  const { buttonValue } = c
  const doiqValue = buttonValue
  const doiqAnswer = getRandomAnswer()
  const userData = {
    doiqValue,
    doiqAnswer
  }
  try {
    let response = await UserService.fetchUserByFidFromFrontend(c.var.interactor?.fid.toString() as string)
    let user = response.user
    if (user) {

      const response = await UserService.UpdateUserFromFrontend(user.fid, userData)
      let nextDoiqTime = "10 Minutes"

      return c.res({
        image: (
          <div
            style={{
              alignItems: 'center',
              background: 'white',
              backgroundSize: '100% 100%',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              height: '100%',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'black',
                fontSize: 62,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                lineHeight: 1,
                marginTop: 30,
                padding: '0 120px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {
                doiqValue === doiqAnswer ?
                  `Thanks for playing. You got it correct, You chose ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
                  :
                  `Thanks for playing. You got it wrong this time. You chose ${doiqValue}, but the answer is ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
              }
            </div>
            <div
              style={{
                color: 'black',
                fontSize: 40,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                lineHeight: 1,
                marginTop: 30,
                padding: '0 120px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`You can doiq again in about ${nextDoiqTime}`}
            </div>
          </div>
        ),
        intents: [
          <Button.Reset>Home</Button.Reset>,
          <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
        ],
      })
    } else {
      const userData = {
        username: c.var.interactor?.username,//fakeData.username
        displayName: c.var.interactor?.displayName,//fakeData.displayName
        fid: c.var.interactor?.fid?.toString(), // fakeData.fid,
        doiqValue,
        doiqAnswer
      }
      const response = await UserService.CreateUserFromFrontend(userData)

      let nextDoiqTime = "10 Minutes"

      return c.res({
        image: (
          <div
            style={{
              alignItems: 'center',
              background: 'white',
              backgroundSize: '100% 100%',
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              height: '100%',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
            }}
          >
            <div
              style={{
                color: 'black',
                fontSize: 62,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                lineHeight: 1,
                marginTop: 30,
                padding: '0 120px',
                whiteSpace: 'pre-wrap',
                textAlign: 'center'
              }}
            >
              {
                doiqValue === doiqAnswer ?
                  `Thanks for playing. You got it correct, You chose ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
                  :
                  `Thanks for playing. You got it wrong this time. You chose ${doiqValue}, but the answer is ${doiqAnswer}. Your answer has been recieved by the great doiq himself`
              }

            </div>
            <div
              style={{
                color: 'black',
                fontSize: 40,
                fontStyle: 'normal',
                letterSpacing: '-0.025em',
                lineHeight: 1,
                marginTop: 30,
                padding: '0 120px',
                whiteSpace: 'pre-wrap',
              }}
            >
              {`You can doiq again in about ${nextDoiqTime}`}
            </div>
          </div>
        ),
        intents: [
          <Button.Reset>Home</Button.Reset>,
          <Button.Link href={`${HOSTNAME}/leaderboard`}>Leaderboard</Button.Link>,
        ],
      })
    }

  } catch (error: any) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'white',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'black',
              fontSize: 62,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {`An error occurred: ${error.message}`}
          </div>
        </div>
      ),
    });
  }


})

// app.frame('/', (c) => {
//   const { buttonValue, status, frameData, verified } = c
//   const fruit = buttonValue
//   return c.res({
//     action: '/doiq',
//     image: (
//       <div
//         style={{
//           alignItems: 'center',
//           background: 'white',
//           backgroundSize: '100% 100%',
//           display: 'flex',
//           flexDirection: 'column',
//           flexWrap: 'nowrap',
//           height: '100%',
//           justifyContent: 'center',
//           textAlign: 'center',
//           width: '100%',
//         }}
//       >
//         <div
//           style={{
//             color: 'black',
//             fontSize: 180,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1.0,
//             padding: '0 120px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           doiq?
//         </div>
//         <div
//           style={{
//             color: 'black',
//             fontSize: 60,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1.4,
//             padding: '0 240px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           click to doiq
//         </div>
//       </div>
//     ),
//     intents: [
//       <Button>Start</Button>,
//       <Button.Link href='https://docs.doiq.xyz/'>Leaderboard</Button.Link>,
//       <Button.Link href='https://docs.doiq.xyz/'>Learn</Button.Link>,
//     ],
//   })
// })

// app.frame('/doiq', (c) => {
//   const { buttonValue, status } = c
//   const fruit = buttonValue
//   // console.log("c: ", c)
//   return c.res({
//     action: '/result',
//     image: (
//       <div
//         style={{
//           alignItems: 'center',
//           background: 'white',
//           backgroundSize: '100% 100%',
//           display: 'flex',
//           flexDirection: 'column',
//           flexWrap: 'nowrap',
//           height: '100%',
//           justifyContent: 'center',
//           textAlign: 'center',
//           width: '100%',
//         }}
//       >
//         <div
//           style={{
//             color: 'black',
//             fontSize: 90,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1.4,
//             marginTop: 30,
//             padding: '0 120px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           I like to _________
//         </div>
//       </div>
//     ),
//     intents: [
//       <Button value="A">doiq</Button>,
//       <Button value="B">doiq?</Button>,
//       <Button value="C">doiq!</Button>,
//     ],
//   })
// })

// app.frame('/result', (c) => {
//   const { buttonValue, status } = c
//   return c.res({
//     image: (
//       <div
//         style={{
//           alignItems: 'center',
//           background: 'white',
//           backgroundSize: '100% 100%',
//           display: 'flex',
//           flexDirection: 'column',
//           flexWrap: 'nowrap',
//           height: '100%',
//           justifyContent: 'center',
//           textAlign: 'center',
//           width: '100%',
//         }}
//       >
//         <div
//           style={{
//             color: 'black',
//             fontSize: 62,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1,
//             marginTop: 30,
//             padding: '0 120px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           Your answer has been recieved by the great doiq himself.
//         </div>
//         <div
//           style={{
//             color: 'black',
//             fontSize: 40,
//             fontStyle: 'normal',
//             letterSpacing: '-0.025em',
//             lineHeight: 1,
//             marginTop: 30,
//             padding: '0 120px',
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           You can doiq again in about X minutes
//         </div>
//       </div>
//     ),
//     intents: [
//       <Button.Reset>Home</Button.Reset>,
//       <Button.Link href='https://docs.doiq.xyz/'>Leaderboard</Button.Link>,
//     ],
//   })
// })

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
