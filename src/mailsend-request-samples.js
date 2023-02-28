const now = new Date();
const tenMinutesLater = new Date(now.getTime() + 10 * 60000);
const timeInSeconds = Math.floor( tenMinutesLater.getTime() / 1000 );

export const samples = 
  [
    {
      "name": "Simple text email",
      "id": "simple-plain",
      "category": "Basic feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp",
                "name": "構研太郎"
              }
            ],
            "subject": "こんにちは！"
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "content": [
          {
            "type": "text/plain",
            "value": "テキストメールです！"
          }
        ]
      }
    },
    {
      "name": "Simple multipart email",
      "id": "simple-multipart",
      "category": "Basic feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp",
                "name": "構研太郎"
              }
            ],
            "subject": "こんにちは！"
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "content": [
          {
            "type": "text/plain",
            "value": "テキストパートです！"
          },
          {
            "type": "text/html",
            "value": "<p>HTMLパートです！</p>"
          }
        ]
      }
    },
    {
      "name": "Dynamic template",
      "id": "dynamic-template",
      "category": "Basic feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp",
                "name": "構研太郎"
              }
            ],
            "dynamic_template_data": {
              "name": "構研", 
              "email": "koken@kke.co.jp", 
              "address": "東京",
              "company": "KKE"
            }
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "template_id": "d-ee385f466a5f4f659c3e881b66e5c5f5"
      }
    },
    {
      "name": "Personalizations kitchen sink",
      "id": "personalizations-kitchen-sink",
      "category": "Basic feature",
      "request":  {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken+alice@kke.co.jp",
                "name": "A. Koken"
              }
            ],
            "bcc": [
              {
                "email": "alice@sink.sendgrid.net"
              }
            ],
            "substitutions": {
              "%name%": "Alice"
            },
            "custom_args": {"Key": "arg-A"},
            "send_at": timeInSeconds,
            "from": {
              "email": "support@example.com"
            }
          },
          {
            "to": [
              {
                "email": "koken+bob@kke.co.jp",
                "name": "B. Koken"
              }
            ],
            "cc": [
              {
                "email": "bob@sink.sendgrid.net"
              },
              {
                "email": "charley@sink.sendgrid.net"
              }
            ],
            "substitutions": {
              "%name%": "Bob"
            },
            "custom_args": {"Key": "arg-B"},
            "subject": "Hello, %name%!",
            "headers": {"X-Foo": "Bar"}
          }
        ],
        "subject": "こんにちは、%name%さん！",
        "reply_to": "%name%@sink.sendgrid.net",
        "from": {
          "email": "noreply@example.com"
        },
        "content": [
          {
            "type": "text/plain",
            "value": "%name%さん、テキストパートです！"
          },
          {
            "type": "text/html",
            "value": "<p>%name%さん、HTMLパートです！</p>"
          }
        ]
      }
    },
    {
      "name": "Scheduled send",
      "id": "scheduled send",
      "category": "Basic feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp",
                "name": "構研太郎"
              }
            ],
            "subject": "Scheduled send"
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "batch_id": "YmRkNjMxMjYtODVhNy0xMWVkLTkzYjQtMWFhZjcyZjY3NzZjLThjNjMxMGI4OA",
        "send_at": timeInSeconds,
        "content": [
          {
            "type": "text/plain",
            "value": "Hello, World!"
          },
          {
            "type": "text/html",
            "value": "<p>Hello, World!</p>"
          }
        ]
      }
    },
    {
      "name": "Category",
      "id": "category",
      "category": "Basic feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp",
                "name": "構研太郎"
              }
            ],
            "subject": "こんにちは！"
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "categories": [
          "notification",
          "marketing"
        ],
        "content": [
          {
            "type": "text/plain",
            "value": "テキストパートです！"
          },
          {
            "type": "text/html",
            "value": "<p>HTMLパートです！</p>"
          }
        ]
      }
    },    {
      "name": "Click & open trackings",
      "id": "trackings",
      "category": "Trackings",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp"
              }
            ]
          }
        ],
        "subject": "Open & Click trackings",
        "from": {"email": "from@example.com"},
        "content": [
          {
            "type": "text/plain",
            "value": "This link is click-tracked:\r\nhttps://sendgrid.kke.co.jp/"
          },
          {
            "type": "text/html",
            "value": "<p><a href=\"https://sendgrid.kke.co.jp/\">This link</a> is click-tracked.</p>"
          }
        ],
        "tracking_settings": {
          "click_tracking": {
            "enable": true,
            "enable_text": true
          },
          "open_tracking": {
            "enable": true
          }
        }
      }
    },
    {
      "name": "Click tracking (text-part disabled)",
      "id": "click-tracking-text-disabled",
      "category": "Trackings",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp"
              }
            ]
          }
        ],
        "subject": "Click tracking (text-part disabled)",
        "from": {"email": "from@example.com"},
        "content": [
          {
            "type": "text/plain",
            "value": "This link is NOT click-tracked:\r\nhttps://sendgrid.kke.co.jp/"
          },
          {
            "type": "text/html",
            "value": "<p><a href=\"https://sendgrid.kke.co.jp/\">This link</a> is click-tracked.</p>"
          }
        ],
        "tracking_settings": {
          "click_tracking": {
            "enable": true,
            "enable_text": false
          }
        }
      }
    },
    {
      "name": "Click tracking (partially disabled)",
      "id": "click-tracking-partially-disabled",
      "category": "Trackings",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp"
              }
            ]
          }
        ],
        "subject": "Click tracking (partially disabled)",
        "from": {"email": "from@example.com"},
        "content": [
          {
            "type": "text/html",
            "value": "<p><a href=\"https://sendgrid.kke.co.jp/\">This link</a> is click-tracked.</p><p>On the other hand, <a href=\"https://www.kke.co.jp/\" clicktracking=off>this link</a> is made the click tracking disabled.</p>"
          }
        ],
        "tracking_settings": {
          "click_tracking": {
            "enable": true
          }
        }
      }
    },
    {
      "name": "Open trackings with substitution tag",
      "id": "open-tracking-with-tag",
      "category": "Trackings",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp"
              }
            ]
          }
        ],
        "subject": "Open trackings with substitution tag",
        "from": {"email": "from@example.com"},
        "content": [
          {
            "type": "text/html",
            "value": "%open-track%<p><a href=\"https://sendgrid.kke.co.jp/\">This link</a> is click-tracked.</p>"
          }
        ],
        "tracking_settings": {
          "click_tracking": {
            "enable": true
          },
          "open_tracking": {
            "enable": true,
            "substitution_tag": "%open-track%"
          }
        }
      }
    },
    {
      "name": "Global unsubscribe",
      "id": "global-unsub",
      "category": "Unsubscribes",
      "request": {
        "personalizations" : [
          {
            "to": [{"email": "koken@kke.co.jp"}]
          }
        ],
        "from": {"email": "from@example.com"},
        "subject": "Global Unsub",
        "asm": {"group_id": 15441},
        "content": [
          {
            "type": "text/plain",
            "value": "配信停止リンク：<%asm_global_unsubscribe_raw_url%>"
          },
          {
            "type": "text/html",
            "value": "<p><a href=\"<%asm_global_unsubscribe_raw_url%>\">配信停止</a>する</p>"
          }
        ]
      }
    },
    {
      "name": "Group unsubscribe",
      "id": "group-unsub",
      "category": "Unsubscribes",
      "request": {
        "personalizations": [{"to":[{"email":"koken@kke.co.jp"}]}],
        "from": {"email":"from@example.com"},
        "subject": "Group unsub",
        "asm": {"group_id": 15441, "groups_to_display": [15440, 15441]},
        "content": [
          {
            "type": "text/plain",
            "value": "配信停止リンク：<%asm_group_unsubscribe_raw_url%>\r\nPreference center：<%asm_preferences_raw_url%>"
          },
          {
            "type":"text/html",
            "value":"<p><a href=\"<%asm_group_unsubscribe_raw_url%>\">配信停止</a>する</p><p><a href=\"<%asm_preferences_raw_url%>\">購買管理</a>する</p>"
          }
        ]
      }
    },
    {
      "name": "Group unsubscribe with subscription tracking",
      "id": "group-unsub-subscription-tracking",
      "category": "Unsubscribes",
      "request": {
        "personalizations" : [
          {
            "to": [{"email": "koken@kke.co.jp"}]
          }
        ],
        "from": {"email": "from@example.com"},
        "subject": "Group unsub with subscription tracking",
        "asm": {"group_id": 15441, "groups_to_display": [15440, 15441]},
        "tracking_settings":{"click_tracking": {"enable": true},"subscription_tracking": {"enable": true}},
        "content": [
          {
            "type": "text/plain",
            "value": "Hello!"
          },
          {
            "type": "text/html",
            "value": "<p>Hello!</p>"
          }
        ]
      }
    },
    {
      "name": "Attach text",
      "id": "attach-text",
      "category": "Advanced feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp"
              }
            ],
            "subject": "テキストファイル添付"
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "content": [
          {
            "type": "text/plain",
            "value": "Hello, World!"
          }
        ],
        "attachments": [
          {
            "type": "text/plain",
            "filename": "hello.txt",
            "content": "aGVsbG8="
          }
        ]
      }
    },
    {
      "name": "Attach PDF",
      "id": "attach-pdf",
      "category": "Advanced feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp"
              }
            ],
            "subject": "PDF添付"
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "content": [
          {
            "type": "text/plain",
            "value": "Hello, World!"
          }
        ],
        "attachments": [
          {
            "type": "application/pdf",
            "filename": "blank.pdf",
            "content": "JVBERi0xLjUKJdDUxdgKMyAwIG9iago8PAovTGVuZ3RoIDggICAgICAgICAKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnjaAwAAAAABCmVuZHN0cmVhbQplbmRvYmoKNyAwIG9iago8PAovUHJvZHVjZXIgKHBkZlRlWC0xLjQwLjIwKQovQ3JlYXRvciAoVGVYKQovQ3JlYXRpb25EYXRlIChEOjIwMjAxMTA0MTExNzA4KzA5JzAwJykKL01vZERhdGUgKEQ6MjAyMDExMDQxMTE3MDgrMDknMDAnKQovVHJhcHBlZCAvRmFsc2UKL1BURVguRnVsbGJhbm5lciAoVGhpcyBpcyBwZGZUZVgsIFZlcnNpb24gMy4xNDE1OTI2NS0yLjYtMS40MC4yMCAoVGVYIExpdmUgMjAxOSkga3BhdGhzZWEgdmVyc2lvbiA2LjMuMSkKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL09ialN0bQovTiA0Ci9GaXJzdCAyMQovTGVuZ3RoIDE1OSAgICAgICAKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnjaXY3BCoJAFEX37yveFzjOlJOCuMhoE4FYO3Ex6EOEcMIZof6+N0YIbS/3nKMwRomZxgSlilGj1AryHMT9/SQUlRkIRGknT5N3uON3DaImZ5e5I8foOlypH83RvrCJeUiyJFIHjeleRmnWAltmxjkRzkWx+qvZdjfy2HDkdMb2t29dF8ILcxLEZewdNioI/p6l8eZhB/giW+MDR7k3qgplbmRzdHJlYW0KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL1hSZWYKL0luZGV4IFswIDldCi9TaXplIDkKL1cgWzEgMiAxXQovUm9vdCA2IDAgUgovSW5mbyA3IDAgUgovSUQgWzxBNkNGQTQ1NjhDMDA2MjdCOEZEMkE4MkJGRUI3NEU1Nz4gPEE2Q0ZBNDU2OEMwMDYyN0I4RkQyQTgyQkZFQjc0RTU3Pl0KL0xlbmd0aCAzOCAgICAgICAgCi9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp42g3GsQ0AIADDsKSw8yUSO/9DB0sGXpgWstBDnxqyMZcPL44CdwplbmRzdHJlYW0KZW5kb2JqCnN0YXJ0eHJlZgo2MjgKJSVFT0YK"
          }
        ]
      }
    },
    {
      "name": "Sandbox mode",
      "id": "sandbox",
      "category": "Advanced feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "koken@kke.co.jp"
              }
            ],
            "subject": "Sandbox"
          }
        ],
        "from": {
          "email": "from@example.com"
        },
        "content": [
          {
            "type": "text/plain",
            "value": "Hello, Sandbox!"
          },
          {
            "type": "text/html",
            "value": "<p>Hello, Sandbox!</p>"
          }
        ],
        "mail_settings":{
          "sandbox_mode": {"enable": true}
        }
      }
    },
    {
      "name": "Kitchen sink",
      "id": "kitchen-sink",
      "category": "Advanced feature",
      "request": {
        "personalizations": [
          {
            "to": [
              {
                "email": "john_doe@example.com",
                "name": "John Doe"
              },
              {
                "email": "julia_doe@example.com",
                "name": "Julia Doe"
              }
            ],
            "cc": [
              {
                "email": "jane_doe@example.com",
                "name": "Jane Doe"
              }
            ],
            "bcc": [
              {
                "email": "james_doe@example.com",
                "name": "Jim Doe"
              }
            ]
          },
          {
            "from": {
              "email": "sales@example.com",
              "name": "Example Sales Team"
            },
            "to": [
              {
                "email": "janice_doe@example.com",
                "name": "Janice Doe"
              }
            ],
            "bcc": [
              {
                "email": "jordan_doe@example.com",
                "name": "Jordan Doe"
              }
            ]
          }
        ],
        "from": {
          "email": "orders@example.com",
          "name": "Example Order Confirmation"
        },
        "reply_to": {
          "email": "customer_service@example.com",
          "name": "Example Customer Service Team"
        },
        "subject": "Your Example Order Confirmation",
        "content": [
          {
            "type": "text/html",
            "value": "<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>"
          }
        ],
        "attachments": [
          {
            "content": "PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCiAgICA8aGVhZD4KICAgICAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4KICAgICAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICAgICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KCiAgICA8L2JvZHk+Cgo8L2h0bWw+Cg==",
            "filename": "index.html",
            "type": "text/html",
            "disposition": "attachment"
          }
        ],
        "categories": [
          "cake",
          "pie",
          "baking"
        ],
        "send_at": timeInSeconds,
        "batch_id": "AsdFgHjklQweRTYuIopzXcVBNm0aSDfGHjklmZcVbNMqWert1znmOP2asDFjkl",
        "asm": {
          "group_id": 12345,
          "groups_to_display": [
            12345
          ]
        },
        "ip_pool_name": "transactional email",
        "mail_settings": {
          "bypass_list_management": {
            "enable": false
          },
          "footer": {
            "enable": false
          },
          "sandbox_mode": {
            "enable": false
          }
        },
        "tracking_settings": {
          "click_tracking": {
            "enable": true,
            "enable_text": false
          },
          "open_tracking": {
            "enable": true,
            "substitution_tag": "%open-track%"
          },
          "subscription_tracking": {
            "enable": false
          }
        }
      }
    }
  ];