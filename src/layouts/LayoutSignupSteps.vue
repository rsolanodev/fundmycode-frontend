<template>
    <div class="LayoutSignupSteps">
        <div class="columns is-full-width-and-height">
            <div class="column is-4 column-left has-background-default px-5 py-4" style="z-index: -1">
                <div class="steps">
                    <div class="media">
                        <div class="media-left"><img src="../assets/logo.png" alt="" width="30"></div>
                        <div class="media-content">
                            Sign up
                        </div>
                    </div>
                    <ul>
                        <li :class="{'in-step': indexStep === 1}">
                            <div class="title is-5">
                                <span class="step-number" v-if="indexStep <= 1">1</span>
                                <span class="step-number check" v-else/>
                                About you
                            </div>
                        </li>
                        <li :class="{'in-step': indexStep === 2}">
                            <div class="title is-5">
                                <span class="step-number" v-if="indexStep <= 2">2</span>
                                <span class="step-number check" v-else/>
                                Set a password
                            </div>
                        </li>
                        <li :class="{'in-step': indexStep === 3}">
                            <div class="title is-5">
                                <span class="step-number" v-if="indexStep <= 3">3</span>
                                <span class="step-number check" v-else/>
                                Welcome
                            </div>
                        </li>
                    </ul>
                    <div></div>
                </div>
            </div>
            <div class="column column-left column-right align-v">
                <slot/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "layout-signup-steps",
        data() {
            return {
                indexStep: parseInt(this.$route.params.index),
            };
        },
        watch: {
            '$route'() {
                this.indexStep = parseInt(this.$route.params.index)
            }
        },
    };
</script>

<style scoped lang="scss">
    .is-full-width-and-height {
        max-width: 100vw;
        min-height: 100vh;
    }

    .columns {
        margin-top: 0;
    }

    .column-right {
        padding: 40px 7vw;
    }

    .column-left {
        padding: 0 30px;
    }

    .media-content {
        font-weight: 600;
        color: #494956;
        padding-top: .25em;
    }

    .steps {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        align-content: space-between;
        height: 100%;

        .step-number {
            width: 50px;
            height: 50px;
            line-height: 50px;
            font-size: .95em;
            margin-right: 1.25em;
            border-radius: 50%;
            padding: 1em;
            position: relative;
            text-align: center;
            display: inline-block;

            &.check {
                background-color: transparent;

                &:after {
                    content: url("../assets/icons/check.svg");
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    box-shadow: none;
                    z-index: -1;
                    top: 25px;
                    left: 12.5px;
                }
            }

            &:after {
                content: '';
                position: absolute;
                width: 50px;
                height: 50px;
                background-color: #fff;
                border-radius: 50%;
                box-shadow: 0 3px 6px rgba(0, 0, 0, .13);
                left: 0;
                z-index: -1;
            }
        }

        li {
            margin: 3em 0;
            opacity: .5;

            &.in-step {
                opacity: 1;
            }
        }
    }

    .align-v {
        display: flex;
        align-items: center;
    }

</style>
